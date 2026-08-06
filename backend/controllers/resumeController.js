import Resume from '../models/Resume.js';
import Profile from '../models/Profile.js';
import User from '../models/User.js';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Calculate a rough ATS score based on resume completeness and content quality.
 */
const calculateAtsScore = (resume) => {
  let score = 0;

  if (resume.personalInfo?.fullName) score += 5;
  if (resume.personalInfo?.email) score += 5;
  if (resume.personalInfo?.phone) score += 5;
  if (resume.personalInfo?.location) score += 5;
  if (resume.personalInfo?.linkedin) score += 5;

  if (resume.summary?.content?.length > 50) score += 15;

  if (resume.experience?.length > 0) {
    score += Math.min(resume.experience.length * 8, 20);
    const hasAchievements = resume.experience.some((e) => e.achievements?.length > 0);
    if (hasAchievements) score += 5;
  }

  if (resume.education?.length > 0) score += Math.min(resume.education.length * 5, 10);

  if (resume.skills?.length >= 5) score += 10;
  else if (resume.skills?.length > 0) score += 5;

  if (resume.certifications?.length > 0) score += 5;
  if (resume.projects?.length > 0) score += 5;

  return Math.min(score, 100);
};

/**
 * Call Gemini with retry logic (consistent with assessmentController pattern).
 */
const callGeminiWithRetry = async (prompt, retries = 2) => {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const result = await model.generateContent(prompt);
      return result.response.text();
    } catch (err) {
      if (attempt === retries) throw err;
      await new Promise((res) => setTimeout(res, 2000));
    }
  }
};

// ─── Controllers ──────────────────────────────────────────────────────────────

/**
 * GET /api/resume
 * Get all resumes for the logged-in user.
 */
export const getMyResumes = async (req, res) => {
  try {
    const resumes = await Resume.find({ user: req.user._id })
      .select('name template isDefault atsScore createdAt updatedAt')
      .sort({ updatedAt: -1 });

    res.json({ success: true, count: resumes.length, resumes });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch resumes', error: err.message });
  }
};

/**
 * GET /api/resume/:id
 * Get a single resume by ID (must belong to user).
 */
export const getResumeById = async (req, res) => {
  try {
    const resume = await Resume.findOne({ _id: req.params.id, user: req.user._id });
    if (!resume) return res.status(404).json({ success: false, message: 'Resume not found' });

    res.json({ success: true, resume });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch resume', error: err.message });
  }
};

/**
 * POST /api/resume
 * Create a new resume, optionally auto-populated from the user's profile.
 * Body: { name, template, autoPopulate }
 */
export const createResume = async (req, res) => {
  try {
    const { name = 'My Resume', template = 'modern', autoPopulate = true } = req.body;

    const user = await User.findById(req.user._id);

    // Default section ordering
    const defaultSections = [
      { type: 'summary', title: 'Professional Summary', enabled: true, order: 0 },
      { type: 'experience', title: 'Work Experience', enabled: true, order: 1 },
      { type: 'education', title: 'Education', enabled: true, order: 2 },
      { type: 'skills', title: 'Skills', enabled: true, order: 3 },
      { type: 'certifications', title: 'Certifications', enabled: true, order: 4 },
      { type: 'projects', title: 'Projects', enabled: true, order: 5 },
    ];

    const resumeData = {
      user: req.user._id,
      name,
      template,
      sections: defaultSections,
      personalInfo: {
        fullName: `${user.firstName} ${user.lastName}`.trim(),
        email: user.email,
      },
    };

    // Auto-populate from profile if requested
    if (autoPopulate) {
      const profile = await Profile.findOne({ user: req.user._id });
      if (profile) {
        // Personal info
        resumeData.personalInfo = {
          fullName: `${user.firstName} ${user.lastName}`.trim(),
          email: user.email,
          phone: profile.personalInfo?.phone || '',
          location: [profile.personalInfo?.location?.city, profile.personalInfo?.location?.country]
            .filter(Boolean)
            .join(', '),
          website: profile.socialLinks?.website || '',
          linkedin: profile.socialLinks?.linkedin || '',
          github: profile.socialLinks?.github || '',
          portfolio: profile.socialLinks?.portfolio || '',
        };

        // Summary from bio
        if (profile.personalInfo?.bio) {
          resumeData.summary = { content: profile.personalInfo.bio, aiEnhanced: false };
        }

        // Experience
        if (profile.experience?.length > 0) {
          resumeData.experience = profile.experience.map((exp) => ({
            company: exp.company || '',
            position: exp.position || '',
            location: exp.location || '',
            startDate: exp.startDate,
            endDate: exp.endDate,
            currentlyWorking: exp.currentlyWorking || false,
            description: exp.description || '',
            achievements: exp.achievements || [],
          }));
        }

        // Education
        if (profile.education?.length > 0) {
          resumeData.education = profile.education.map((edu) => ({
            institution: edu.institution || '',
            degree: edu.degree || '',
            fieldOfStudy: edu.fieldOfStudy || '',
            startDate: edu.startDate,
            endDate: edu.endDate,
            currentlyStudying: edu.currentlyStudying || false,
            grade: edu.grade || '',
            description: edu.description || '',
          }));
        }

        // Skills
        if (profile.skills?.length > 0) {
          resumeData.skills = profile.skills.map((skill) => ({
            name: skill.name || '',
            category: skill.category || 'Technical',
            proficiency: skill.proficiency || '',
          }));
        }

        // Certifications
        if (profile.certifications?.length > 0) {
          resumeData.certifications = profile.certifications.map((cert) => ({
            name: cert.name || '',
            issuingOrganization: cert.issuingOrganization || '',
            issueDate: cert.issueDate,
            expiryDate: cert.expiryDate,
            credentialId: cert.credentialId || '',
            credentialUrl: cert.credentialUrl || '',
          }));
        }
      }
    }

    const resume = new Resume(resumeData);
    resume.atsScore = calculateAtsScore(resume);

    // If this is the user's first resume, mark as default
    const existingCount = await Resume.countDocuments({ user: req.user._id });
    if (existingCount === 0) resume.isDefault = true;

    await resume.save();

    res.status(201).json({ success: true, message: 'Resume created successfully', resume });
  } catch (err) {
    console.error('CREATE RESUME ERROR:', err);
    res.status(500).json({ success: false, message: 'Failed to create resume', error: err.message });
  }
};

/**
 * PUT /api/resume/:id
 * Update a resume (any field).
 */
export const updateResume = async (req, res) => {
  try {
    const resume = await Resume.findOne({ _id: req.params.id, user: req.user._id });
    if (!resume) return res.status(404).json({ success: false, message: 'Resume not found' });

    const allowedFields = [
      'name', 'template', 'personalInfo', 'summary', 'experience',
      'education', 'skills', 'certifications', 'projects', 'customSections', 'sections',
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) resume[field] = req.body[field];
    });

    resume.atsScore = calculateAtsScore(resume);

    await Resume.findByIdAndUpdate(
      resume._id,
      {
        $set: {
          name: resume.name,
          template: resume.template,
          personalInfo: resume.personalInfo,
          summary: resume.summary,
          experience: resume.experience,
          education: resume.education,
          skills: resume.skills,
          certifications: resume.certifications,
          projects: resume.projects,
          customSections: resume.customSections,
          sections: resume.sections,
          atsScore: resume.atsScore,
        },
      },
      { new: true }
    );

    const updated = await Resume.findById(resume._id);
    res.json({ success: true, message: 'Resume updated successfully', resume: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to update resume', error: err.message });
  }
};

/**
 * DELETE /api/resume/:id
 * Delete a resume.
 */
export const deleteResume = async (req, res) => {
  try {
    const resume = await Resume.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!resume) return res.status(404).json({ success: false, message: 'Resume not found' });

    // If deleted resume was default, make the most recent remaining one default
    if (resume.isDefault) {
      const next = await Resume.findOne({ user: req.user._id }).sort({ updatedAt: -1 });
      if (next) await Resume.findByIdAndUpdate(next._id, { isDefault: true });
    }

    res.json({ success: true, message: 'Resume deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to delete resume', error: err.message });
  }
};

/**
 * PUT /api/resume/:id/default
 * Set a resume as the default.
 */
export const setDefaultResume = async (req, res) => {
  try {
    const resume = await Resume.findOne({ _id: req.params.id, user: req.user._id });
    if (!resume) return res.status(404).json({ success: false, message: 'Resume not found' });

    // Unset all others first
    await Resume.updateMany({ user: req.user._id }, { isDefault: false });
    await Resume.findByIdAndUpdate(resume._id, { isDefault: true });

    res.json({ success: true, message: 'Default resume updated' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to set default resume', error: err.message });
  }
};

/**
 * POST /api/resume/:id/ai-enhance
 * Use Gemini to enhance a specific section of the resume.
 * Body: { section: 'summary' | 'experience' | 'project', itemId?: string }
 */
export const aiEnhanceSection = async (req, res) => {
  try {
    const { section, itemId } = req.body;
    const resume = await Resume.findOne({ _id: req.params.id, user: req.user._id });
    if (!resume) return res.status(404).json({ success: false, message: 'Resume not found' });

    let prompt = '';
    let enhanced = '';

    if (section === 'summary') {
      const context = {
        name: resume.personalInfo?.fullName,
        currentSummary: resume.summary?.content || '',
        topSkills: resume.skills?.slice(0, 8).map((s) => s.name).join(', '),
        experience: resume.experience?.map((e) => `${e.position} at ${e.company}`).join('; '),
      };
      prompt = `You are a professional resume writer. Enhance the following professional summary to be more impactful, concise (3-5 sentences), and ATS-friendly. Use strong action words and quantifiable language where possible. Return ONLY the improved summary text, nothing else.

Name: ${context.name}
Current Summary: ${context.currentSummary || 'None provided'}
Key Skills: ${context.topSkills || 'Not specified'}
Experience: ${context.experience || 'Not specified'}`;

      enhanced = await callGeminiWithRetry(prompt);
      resume.summary = { content: enhanced.trim(), aiEnhanced: true };

    } else if (section === 'experience' && itemId) {
      const expIndex = resume.experience.findIndex((e) => e._id.toString() === itemId);
      if (expIndex === -1) return res.status(404).json({ success: false, message: 'Experience entry not found' });

      const exp = resume.experience[expIndex];
      prompt = `You are a professional resume writer. Improve the following job description to be more impactful and ATS-friendly. Use strong past-tense action verbs (Led, Developed, Implemented, Achieved, etc.). Be concise. Return ONLY the improved description text, nothing else.

Position: ${exp.position}
Company: ${exp.company}
Current Description: ${exp.description || 'None provided'}
Achievements: ${exp.achievements?.join('; ') || 'None'}`;

      enhanced = await callGeminiWithRetry(prompt);
      resume.experience[expIndex].description = enhanced.trim();
      resume.experience[expIndex].aiEnhanced = true;

    } else if (section === 'project' && itemId) {
      const projIndex = resume.projects.findIndex((p) => p._id.toString() === itemId);
      if (projIndex === -1) return res.status(404).json({ success: false, message: 'Project not found' });

      const proj = resume.projects[projIndex];
      prompt = `You are a professional resume writer. Improve this project description to highlight technical impact, skills used, and outcomes. Keep it to 2-3 sentences. Return ONLY the improved description, nothing else.

Project: ${proj.name}
Technologies: ${proj.technologies?.join(', ') || 'Not specified'}
Current Description: ${proj.description || 'None provided'}`;

      enhanced = await callGeminiWithRetry(prompt);
      resume.projects[projIndex].description = enhanced.trim();
      resume.projects[projIndex].aiEnhanced = true;

    } else {
      return res.status(400).json({ success: false, message: 'Invalid section or missing itemId' });
    }

    resume.atsScore = calculateAtsScore(resume);
    await Resume.findByIdAndUpdate(resume._id, {
      $set: {
        summary: resume.summary,
        experience: resume.experience,
        projects: resume.projects,
        atsScore: resume.atsScore,
      },
    });

    res.json({
      success: true,
      message: 'Section enhanced by AI',
      enhanced: enhanced.trim(),
      atsScore: resume.atsScore,
    });
  } catch (err) {
    console.error('AI ENHANCE ERROR:', err);
    res.status(500).json({ success: false, message: 'AI enhancement failed', error: err.message });
  }
};

/**
 * GET /api/resume/:id/ats-tips
 * Get ATS optimization tips for the resume.
 */
export const getAtsTips = async (req, res) => {
  try {
    const resume = await Resume.findOne({ _id: req.params.id, user: req.user._id });
    if (!resume) return res.status(404).json({ success: false, message: 'Resume not found' });

    const tips = [];

    if (!resume.summary?.content || resume.summary.content.length < 50)
      tips.push({ type: 'warning', message: 'Add a professional summary (aim for 3-5 sentences).' });

    if (!resume.experience?.length)
      tips.push({ type: 'error', message: 'Add at least one work experience entry.' });
    else {
      const missingDesc = resume.experience.filter((e) => !e.description || e.description.length < 30);
      if (missingDesc.length)
        tips.push({ type: 'warning', message: `${missingDesc.length} experience entry(s) are missing detailed descriptions.` });
    }

    if (!resume.education?.length)
      tips.push({ type: 'warning', message: 'Add your education details.' });

    if (!resume.skills?.length)
      tips.push({ type: 'error', message: 'Add relevant skills — ATS systems scan for keywords.' });
    else if (resume.skills.length < 6)
      tips.push({ type: 'info', message: 'Consider adding more skills (aim for 8-12 relevant skills).' });

    if (!resume.personalInfo?.linkedin)
      tips.push({ type: 'info', message: 'Add your LinkedIn profile URL.' });

    if (!resume.personalInfo?.phone)
      tips.push({ type: 'warning', message: 'Add a contact phone number.' });

    if (resume.atsScore < 50)
      tips.push({ type: 'error', message: 'Your ATS score is low. Complete more sections to improve it.' });
    else if (resume.atsScore < 75)
      tips.push({ type: 'warning', message: 'Your ATS score is moderate. Fill in missing details.' });
    else
      tips.push({ type: 'success', message: 'Good ATS coverage! Consider AI-enhancing your summary and experience.' });

    res.json({ success: true, atsScore: resume.atsScore, tips });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to get ATS tips', error: err.message });
  }
};
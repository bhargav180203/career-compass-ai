import LearningPath from '../models/LearningPath.js';
import Profile from '../models/Profile.js';
import Assessment from '../models/Assessment.js';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// ─── Helpers ──────────────────────────────────────────────────────────────────

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

const recalculateProgress = (path) => {
  let total = 0;
  let completed = 0;
  path.phases.forEach((phase) => {
    phase.topics.forEach((topic) => {
      total++;
      if (topic.isCompleted) completed++;
    });
  });
  path.totalTopics = total;
  path.completedTopics = completed;
  path.progressPercentage = total > 0 ? Math.round((completed / total) * 100) : 0;
  path.isCompleted = total > 0 && completed === total;
  if (path.isCompleted && !path.completedAt) path.completedAt = new Date();
  return path;
};

// Fallback learning path if Gemini fails
const getFallbackPath = (targetRole) => ({
  title: `Learning Path: ${targetRole}`,
  description: `A structured learning path to become a ${targetRole}.`,
  totalDuration: '6 months',
  difficulty: 'Mixed',
  phases: [
    {
      title: 'Foundation',
      description: 'Build core fundamentals',
      duration: '4 weeks',
      order: 0,
      topics: [
        {
          title: 'Core Concepts',
          description: `Understand the fundamentals required for ${targetRole}`,
          estimatedTime: '2 weeks',
          difficulty: 'Beginner',
          resources: [
            { title: `${targetRole} Fundamentals`, url: 'https://www.coursera.org', platform: 'Coursera', type: 'course', isFree: false },
            { title: 'YouTube Tutorials', url: 'https://www.youtube.com', platform: 'YouTube', type: 'video', isFree: true },
          ],
        },
      ],
    },
    {
      title: 'Core Skills',
      description: 'Develop practical skills',
      duration: '8 weeks',
      order: 1,
      topics: [
        {
          title: 'Hands-on Practice',
          description: 'Build real projects to solidify your skills',
          estimatedTime: '4 weeks',
          difficulty: 'Intermediate',
          resources: [
            { title: 'Project-Based Learning', url: 'https://www.udemy.com', platform: 'Udemy', type: 'course', isFree: false },
          ],
        },
      ],
    },
  ],
});

// ─── Controllers ──────────────────────────────────────────────────────────────

/**
 * GET /api/learning/my-paths
 * Get all learning paths for the user.
 */
export const getMyPaths = async (req, res) => {
  try {
    const paths = await LearningPath.find({ user: req.user._id })
      .select('title targetRole difficulty totalDuration progressPercentage isCompleted generatedFrom createdAt totalTopics completedTopics')
      .sort({ updatedAt: -1 });

    res.json({ success: true, count: paths.length, paths });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch learning paths', error: err.message });
  }
};

/**
 * GET /api/learning/:id
 * Get a specific learning path.
 */
export const getPathById = async (req, res) => {
  try {
    const path = await LearningPath.findOne({ _id: req.params.id, user: req.user._id });
    if (!path) return res.status(404).json({ success: false, message: 'Learning path not found' });

    res.json({ success: true, path });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch learning path', error: err.message });
  }
};

/**
 * POST /api/learning/generate
 * Generate a new learning path using Gemini AI.
 * Body: { generatedFrom: 'assessment' | 'manual', targetRole?: string, assessmentId?: string }
 */
export const generatePath = async (req, res) => {
  try {
    const { generatedFrom = 'manual', targetRole, assessmentId } = req.body;

    // Get user profile for context
    const profile = await Profile.findOne({ user: req.user._id });
    const currentSkills = profile?.skills?.map((s) => s.name) || [];

    let targetRoleFinal = targetRole;
    let assessmentContext = '';
    let assessmentIdFinal = null;

    // If generating from assessment, pull data
    if (generatedFrom === 'assessment') {
      const query = assessmentId
        ? { _id: assessmentId, user: req.user._id }
        : { user: req.user._id, status: 'completed' };

      const assessment = await Assessment.findOne(query).sort({ createdAt: -1 });

      if (!assessment) {
        return res.status(400).json({
          success: false,
          message: 'No completed assessment found. Please complete a career assessment first.',
        });
      }

      assessmentIdFinal = assessment._id;
      const topCareer = assessment.aiAnalysis?.careerRecommendations?.[0]?.title || 'Software Engineer';
      targetRoleFinal = targetRoleFinal || topCareer;

      assessmentContext = `
Personality Type: ${assessment.results?.personalityType || 'Not specified'}
Top Career Recommendations: ${assessment.aiAnalysis?.careerRecommendations?.slice(0, 3).map((c) => c.title).join(', ') || 'Not specified'}
Strengths: ${assessment.aiAnalysis?.strengths?.join(', ') || 'Not specified'}
`;
    }

    if (!targetRoleFinal) {
      return res.status(400).json({ success: false, message: 'Target role is required' });
    }

    const prompt = `You are a career development expert. Create a detailed, personalized learning path for someone who wants to become a "${targetRoleFinal}".

Current Skills: ${currentSkills.length > 0 ? currentSkills.join(', ') : 'None specified'}
${assessmentContext}

Generate a comprehensive learning roadmap. Return ONLY a valid JSON object with NO markdown, NO code blocks, NO explanation.

The JSON must follow this exact structure:
{
  "title": "Learning Path: ${targetRoleFinal}",
  "description": "2-3 sentence overview of this learning path",
  "totalDuration": "X months",
  "difficulty": "Beginner|Intermediate|Advanced|Mixed",
  "missingSkills": ["skill1", "skill2", "skill3", "skill4", "skill5"],
  "phases": [
    {
      "title": "Phase name",
      "description": "Phase description",
      "duration": "X weeks",
      "order": 0,
      "topics": [
        {
          "title": "Topic title",
          "description": "What you will learn",
          "estimatedTime": "X hours/days/weeks",
          "difficulty": "Beginner|Intermediate|Advanced",
          "resources": [
            {
              "title": "Resource name",
              "url": "https://actual-url.com",
              "platform": "Coursera|Udemy|YouTube|edX|freeCodeCamp|MDN|Documentation|Blog|Other",
              "type": "course|video|article|documentation|project|other",
              "duration": "X hours",
              "isFree": true|false
            }
          ]
        }
      ]
    }
  ]
}

Rules:
- Create 3-4 phases (Foundation, Core Skills, Advanced Topics, Portfolio/Job Ready)
- Each phase should have 2-4 topics
- Each topic should have 2-3 real resources with actual working URLs
- Use real course URLs from Coursera, Udemy, YouTube, freeCodeCamp etc.
- Resources should be a mix of free and paid
- Total duration should be realistic (3-12 months)
- Focus on practical, job-ready skills`;

    let pathData;
    try {
      const raw = await callGeminiWithRetry(prompt);
      const clean = raw.replace(/```json|```/g, '').trim();
      pathData = JSON.parse(clean);
    } catch (aiErr) {
      console.error('Gemini error, using fallback:', aiErr.message);
      pathData = getFallbackPath(targetRoleFinal);
    }

    // Build the learning path document
    const learningPath = new LearningPath({
      user: req.user._id,
      title: pathData.title || `Learning Path: ${targetRoleFinal}`,
      targetRole: targetRoleFinal,
      description: pathData.description || '',
      totalDuration: pathData.totalDuration || '6 months',
      difficulty: pathData.difficulty || 'Mixed',
      generatedFrom,
      assessmentId: assessmentIdFinal,
      currentSkills,
      missingSkills: pathData.missingSkills || [],
      phases: (pathData.phases || []).map((phase, idx) => ({
        title: phase.title,
        description: phase.description || '',
        duration: phase.duration || '',
        order: phase.order ?? idx,
        topics: (phase.topics || []).map((topic) => ({
          title: topic.title,
          description: topic.description || '',
          estimatedTime: topic.estimatedTime || '',
          difficulty: topic.difficulty || 'Beginner',
          resources: (topic.resources || []).map((r) => ({
            title: r.title || '',
            url: r.url || '',
            platform: r.platform || 'Other',
            type: r.type || 'course',
            duration: r.duration || '',
            isFree: r.isFree ?? true,
          })),
          isCompleted: false,
        })),
      })),
    });

    // Calculate initial progress
    recalculateProgress(learningPath);
    await learningPath.save();

    res.status(201).json({
      success: true,
      message: 'Learning path generated successfully',
      path: learningPath,
    });
  } catch (err) {
    console.error('GENERATE PATH ERROR:', err);
    res.status(500).json({ success: false, message: 'Failed to generate learning path', error: err.message });
  }
};

/**
 * PUT /api/learning/:id/progress
 * Mark a topic as complete or incomplete.
 * Body: { phaseIndex, topicIndex, isCompleted }
 */
export const updateProgress = async (req, res) => {
  try {
    const { phaseIndex, topicIndex, isCompleted } = req.body;

    const path = await LearningPath.findOne({ _id: req.params.id, user: req.user._id });
    if (!path) return res.status(404).json({ success: false, message: 'Learning path not found' });

    if (!path.phases[phaseIndex] || !path.phases[phaseIndex].topics[topicIndex]) {
      return res.status(400).json({ success: false, message: 'Invalid phase or topic index' });
    }

    path.phases[phaseIndex].topics[topicIndex].isCompleted = isCompleted;
    path.phases[phaseIndex].topics[topicIndex].completedAt = isCompleted ? new Date() : null;

    recalculateProgress(path);

    await LearningPath.findByIdAndUpdate(
      path._id,
      {
        $set: {
          phases: path.phases,
          totalTopics: path.totalTopics,
          completedTopics: path.completedTopics,
          progressPercentage: path.progressPercentage,
          isCompleted: path.isCompleted,
          completedAt: path.completedAt,
        },
      },
      { new: true }
    );

    res.json({
      success: true,
      message: 'Progress updated',
      progressPercentage: path.progressPercentage,
      completedTopics: path.completedTopics,
      totalTopics: path.totalTopics,
      isCompleted: path.isCompleted,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to update progress', error: err.message });
  }
};

/**
 * DELETE /api/learning/:id
 * Delete a learning path.
 */
export const deletePath = async (req, res) => {
  try {
    const path = await LearningPath.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!path) return res.status(404).json({ success: false, message: 'Learning path not found' });

    res.json({ success: true, message: 'Learning path deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to delete learning path', error: err.message });
  }
};
import axios from 'axios';
import SavedJob from '../models/SavedJob.js';
import Profile from '../models/Profile.js';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const ADZUNA_APP_ID = process.env.ADZUNA_APP_ID;
const ADZUNA_APP_KEY = process.env.ADZUNA_APP_KEY;
const ADZUNA_BASE = 'https://api.adzuna.com/v1/api/jobs/in/search'; // 'in' = India


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

const formatJob = (job) => ({
  jobId: job.id,
  title: job.title || '',
  company: job.company?.display_name || '',
  location: job.location?.display_name || '',
  description: job.description || '',
  salary: {
    min: job.salary_min || null,
    max: job.salary_max || null,
    currency: 'INR',
  },
  jobType: job.contract_time || '',
  category: job.category?.label || '',
  applyUrl: job.redirect_url || '',
  postedAt: job.created || null,
});


/**
 * GET /api/jobs/search
 * Query params: q, location, page, results_per_page, job_type, experience
 */
export const searchJobs = async (req, res) => {
  try {
    const {
      q = 'software engineer',
      location = 'India',
      page = 1,
      results_per_page = 10,
      job_type = '',
      sort_by = 'relevance',
    } = req.query;

    const params = {
      app_id: ADZUNA_APP_ID,
      app_key: ADZUNA_APP_KEY,
      results_per_page: Math.min(parseInt(results_per_page), 20),
      what: q,
      where: location,
      sort_by
    };

    if (job_type) params.full_time = job_type === 'full_time' ? 1 : 0;

    const { data } = await axios.get(`${ADZUNA_BASE}/${page}`, { params });

    const jobs = (data.results || []).map(formatJob);

    // If user is logged in, mark which jobs they've saved
    let savedJobIds = [];
    if (req.user) {
      const saved = await SavedJob.find({ user: req.user._id }).select('jobId');
      savedJobIds = saved.map((s) => s.jobId);
    }

    const jobsWithSaved = jobs.map((job) => ({
      ...job,
      isSaved: savedJobIds.includes(job.jobId),
    }));

    res.json({
      success: true,
      count: data.count || 0,
      page: parseInt(page),
      totalPages: Math.ceil((data.count || 0) / results_per_page),
      jobs: jobsWithSaved,
    });
  } catch (err) {
    console.error('JOB SEARCH ERROR FULL:', err.response?.data || err.message);
    res.status(500).json({ success: false, message: 'Job search failed', error: err.message });
  }
};

/**
 * GET /api/jobs/saved
 * Get all saved jobs for the logged-in user.
 */
export const getSavedJobs = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = { user: req.user._id };
    if (status) filter.status = status;

    const jobs = await SavedJob.find(filter).sort({ updatedAt: -1 });
    res.json({ success: true, count: jobs.length, jobs });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch saved jobs', error: err.message });
  }
};

/**
 * POST /api/jobs/save
 * Save a job to user's list.
 * Body: { jobId, title, company, location, description, salary, jobType, category, applyUrl, postedAt }
 */
export const saveJob = async (req, res) => {
  try {
    const { jobId } = req.body;
    if (!jobId) return res.status(400).json({ success: false, message: 'jobId is required' });

    // Check for duplicate
    const existing = await SavedJob.findOne({ user: req.user._id, jobId });
    if (existing) return res.status(400).json({ success: false, message: 'Job already saved' });

    const savedJob = new SavedJob({
      user: req.user._id,
      ...req.body,
      status: 'saved',
    });

    await savedJob.save();
    res.status(201).json({ success: true, message: 'Job saved successfully', job: savedJob });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to save job', error: err.message });
  }
};

/**
 * DELETE /api/jobs/saved/:id
 * Remove a saved job.
 */
export const unsaveJob = async (req, res) => {
  try {
    const job = await SavedJob.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!job) return res.status(404).json({ success: false, message: 'Saved job not found' });

    res.json({ success: true, message: 'Job removed from saved list' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to remove job', error: err.message });
  }
};

/**
 * DELETE /api/jobs/saved/by-job-id/:jobId
 * Remove a saved job by Adzuna jobId (used directly from search results).
 */
export const unsaveJobByJobId = async (req, res) => {
  try {
    const job = await SavedJob.findOneAndDelete({
      jobId: req.params.jobId,
      user: req.user._id,
    });
    if (!job) return res.status(404).json({ success: false, message: 'Saved job not found' });

    res.json({ success: true, message: 'Job removed from saved list' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to remove job', error: err.message });
  }
};

/**
 * PUT /api/jobs/saved/:id/status
 * Update application status and notes.
 * Body: { status, notes }
 */
export const updateJobStatus = async (req, res) => {
  try {
    const { status, notes } = req.body;

    const update = {};
    if (status) {
      update.status = status;
      if (status === 'applied') update.appliedAt = new Date();
    }
    if (notes !== undefined) update.notes = notes;

    const job = await SavedJob.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { $set: update },
      { new: true }
    );

    if (!job) return res.status(404).json({ success: false, message: 'Saved job not found' });

    res.json({ success: true, message: 'Status updated', job });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to update status', error: err.message });
  }
};

/**
 * POST /api/jobs/match-score
 * Use Gemini to calculate AI match score between user profile and a job.
 * Body: { jobId, title, company, description, category, jobType }
 */
export const getMatchScore = async (req, res) => {
  try {
    const { jobId, title, company, description } = req.body;

    // Get user profile for context
    const profile = await Profile.findOne({ user: req.user._id });

    const userContext = profile
      ? {
          skills: profile.skills?.map((s) => s.name).join(', ') || 'Not specified',
          experience: profile.experience?.map((e) => `${e.position} at ${e.company}`).join('; ') || 'Not specified',
          education: profile.education?.map((e) => `${e.degree} from ${e.institution}`).join('; ') || 'Not specified',
          desiredRoles: profile.careerPreferences?.desiredRoles?.join(', ') || 'Not specified',
        }
      : { skills: 'Not specified', experience: 'Not specified', education: 'Not specified', desiredRoles: 'Not specified' };

    const prompt = `You are a career advisor. Analyze how well this candidate matches the job and return ONLY a JSON object, no markdown, no explanation.

Job Title: ${title}
Company: ${company}
Job Description: ${description?.slice(0, 800)}

Candidate Profile:
- Skills: ${userContext.skills}
- Experience: ${userContext.experience}
- Education: ${userContext.education}
- Desired Roles: ${userContext.desiredRoles}

Return ONLY this JSON:
{
  "score": <number 0-100>,
  "reasons": ["reason 1", "reason 2", "reason 3"],
  "missingSkills": ["skill 1", "skill 2"],
  "verdict": "<one sentence summary>"
}`;

    const raw = await callGeminiWithRetry(prompt);
    const clean = raw.replace(/```json|```/g, '').trim();
    const result = JSON.parse(clean);

    // Save match score to the saved job if it exists
    await SavedJob.findOneAndUpdate(
      { user: req.user._id, jobId },
      { $set: { matchScore: result.score, matchReasons: result.reasons } }
    );

    res.json({ success: true, ...result });
  } catch (err) {
    console.error('MATCH SCORE ERROR:', err.message);
    // Fallback score
    res.json({
      success: true,
      score: 70,
      reasons: ['Profile analysis unavailable', 'Score is estimated'],
      missingSkills: [],
      verdict: 'Unable to generate detailed analysis. Please try again.',
    });
  }
};

/**
 * GET /api/jobs/stats
 * Get application statistics for the logged-in user.
 */
export const getJobStats = async (req, res) => {
  try {
    const stats = await SavedJob.aggregate([
      { $match: { user: req.user._id } },
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    const result = { saved: 0, applied: 0, interviewing: 0, offered: 0, rejected: 0, total: 0 };
    stats.forEach(({ _id, count }) => {
      if (_id && result[_id] !== undefined) result[_id] = count;
      result.total += count;
    });

    res.json({ success: true, stats: result });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to get stats', error: err.message });
  }
};
import express from 'express';
import {
  searchJobs,
  getSavedJobs,
  saveJob,
  unsaveJob,
  unsaveJobByJobId,
  updateJobStatus,
  getMatchScore,
  getJobStats,
} from '../controllers/jobController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public (but optionally auth to mark saved jobs)
router.get('/search', protect, searchJobs);

// Protected
router.get('/saved', protect, getSavedJobs);
router.get('/stats', protect, getJobStats);
router.post('/save', protect, saveJob);
router.post('/match-score', protect, getMatchScore);
router.delete('/saved/by-job-id/:jobId', protect, unsaveJobByJobId);
router.delete('/saved/:id', protect, unsaveJob);
router.put('/saved/:id/status', protect, updateJobStatus);

export default router;
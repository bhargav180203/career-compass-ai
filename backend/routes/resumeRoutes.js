import express from 'express';
import {
  getMyResumes,
  getResumeById,
  createResume,
  updateResume,
  deleteResume,
  setDefaultResume,
  aiEnhanceSection,
  getAtsTips,
} from '../controllers/resumeController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// All resume routes are protected
router.use(protect);

router.get('/', getMyResumes);
router.post('/', createResume);

router.get('/:id', getResumeById);
router.put('/:id', updateResume);
router.delete('/:id', deleteResume);

router.put('/:id/default', setDefaultResume);
router.post('/:id/ai-enhance', aiEnhanceSection);
router.get('/:id/ats-tips', getAtsTips);

export default router;
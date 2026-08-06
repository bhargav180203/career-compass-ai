// backend/routes/assessmentRoutes.js
import express from 'express';
import {
  getAssessmentQuestions,
  startAssessment,
  submitAssessment,
  getMyAssessments,
  getAssessmentById,
} from '../controllers/assessmentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes are protected
router.use(protect);

router.get('/questions', getAssessmentQuestions);
router.post('/start', startAssessment);
router.post('/submit', submitAssessment);
router.get('/my-assessments', getMyAssessments);
router.get('/:id', getAssessmentById);

export default router;
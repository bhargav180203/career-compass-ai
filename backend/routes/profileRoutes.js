// backend/routes/profileRoutes.js
import express from 'express';
import {
  getMyProfile,
  updatePersonalInfo,
  addEducation,
  updateEducation,
  deleteEducation,
  addExperience,
  updateExperience,
  deleteExperience,
  updateSkills,
  addCertification,
  deleteCertification,
  updateCareerPreferences
} from '../controllers/profileController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes are protected
router.use(protect);

// Profile
router.get('/me', getMyProfile);
router.put('/personal-info', updatePersonalInfo);

// Education
router.post('/education', addEducation);
router.put('/education/:id', updateEducation);
router.delete('/education/:id', deleteEducation);

// Experience
router.post('/experience', addExperience);
router.put('/experience/:id', updateExperience);
router.delete('/experience/:id', deleteExperience);

// Skills
router.put('/skills', updateSkills);

// Certifications
router.post('/certification', addCertification);
router.delete('/certification/:id', deleteCertification);

// Career Preferences
router.put('/career-preferences', updateCareerPreferences);

export default router;
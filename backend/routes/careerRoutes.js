// backend/routes/careerRoutes.js
import express from 'express';
import {
  getAllCareers,
  getCareerBySlug,
  getRecommendedCareers,
  getFilterOptions,
  getFeaturedCareers,
  searchCareers,
  getCareerStats
} from '../controllers/careerController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getAllCareers);                    // GET /api/careers?search=&industry=&page=1
router.get('/featured', getFeaturedCareers);       // GET /api/careers/featured
router.get('/search', searchCareers);              // GET /api/careers/search?q=software
router.get('/filters', getFilterOptions);          // GET /api/careers/filters
router.get('/stats', getCareerStats);              // GET /api/careers/stats
router.get('/:slug', getCareerBySlug);             // GET /api/careers/software-engineer

// Protected routes (require authentication)
router.get('/recommended/me', protect, getRecommendedCareers);  // GET /api/careers/recommended/me

export default router;
import express from 'express';
import { getCareerRecommendation} from '../controllers/aiController.js';

const router = express.Router();

// Test route to check if API is working
router.get('/test', (req, res) => {
  res.json({ 
    message: 'API Routes are working!',
    endpoints: {
      testAI: 'GET /api/ai/test',
      careerRecommendation: 'POST /api/ai/career-recommendation'
    }
  });
});

// AI Routes
router.post('/career-recommendation', getCareerRecommendation);

export default router;
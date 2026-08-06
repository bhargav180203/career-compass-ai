import express from 'express';
import {
  getMyPaths,
  getPathById,
  generatePath,
  updateProgress,
  deletePath,
} from '../controllers/learningPathController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/my-paths', getMyPaths);
router.post('/generate', generatePath);
router.get('/:id', getPathById);
router.put('/:id/progress', updateProgress);
router.delete('/:id', deletePath);

export default router;
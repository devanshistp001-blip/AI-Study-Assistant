import express from 'express';
import * as mcqsController from '../controllers/mcqsController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/generate', protect, mcqsController.generateMCQs);
router.get('/', protect, mcqsController.getAllMCQs);
router.get('/:id', protect, mcqsController.getMCQ);
router.delete('/:id', protect, mcqsController.deleteMCQ);

export default router;

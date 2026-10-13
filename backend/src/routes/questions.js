import express from 'express';
import * as questionsController from '../controllers/questionsController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/generate', protect, questionsController.generateQuestions);
router.get('/', protect, questionsController.getAllQuestions);
router.get('/:id', protect, questionsController.getQuestion);
router.delete('/:id', protect, questionsController.deleteQuestion);

export default router;

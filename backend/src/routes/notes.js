import express from 'express';
import * as notesController from '../controllers/notesController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/generate', protect, notesController.generateNotes);
router.get('/', protect, notesController.getAllNotes);
router.get('/:id', protect, notesController.getNote);
router.delete('/:id', protect, notesController.deleteNote);

export default router;

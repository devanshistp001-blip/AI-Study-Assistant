import express from 'express';
import * as chatController from '../controllers/chatController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/message', protect, chatController.sendMessage);
router.get('/', protect, chatController.getChats);
router.get('/:id', protect, chatController.getChat);
router.delete('/:id', protect, chatController.deleteChat);

export default router;

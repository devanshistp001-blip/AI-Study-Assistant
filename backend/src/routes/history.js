import express from 'express';
import * as historyController from '../controllers/historyController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, historyController.getHistory);

export default router;

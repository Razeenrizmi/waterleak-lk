import express from 'express';
import { analyzeLeak } from '../controllers/aiController.js';

const router = express.Router();

// Member 3: POST /api/ai/analyze
router.post('/analyze', analyzeLeak);

export default router;

import express from 'express';
import Leak from '../models/Leak.js';

const router = express.Router();

// Member 1: POST /api/reports - Submit a leak report
router.post('/', async (req, res) => {
  try {
    const leak = await Leak.create(req.body);
    res.status(201).json({ success: true, data: leak });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

export default router;

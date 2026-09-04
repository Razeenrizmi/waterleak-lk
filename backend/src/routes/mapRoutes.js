import express from 'express';
import Leak from '../models/Leak.js';

const router = express.Router();

// Member 2: GET /api/map/leaks - Get all leaks for interactive map
router.get('/leaks', async (req, res) => {
  try {
    const leaks = await Leak.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: leaks.length, data: leaks });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;

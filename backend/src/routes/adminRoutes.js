import express from 'express';
import Leak from '../models/Leak.js';

const router = express.Router();

// Member 4: GET /api/admin/triage - Admin overview & statistics
router.get('/triage', async (req, res) => {
  try {
    const totalLeaks = await Leak.countDocuments();
    const criticalCount = await Leak.countDocuments({ severityLevel: 'CRITICAL' });
    const pendingCount = await Leak.countDocuments({ status: 'PENDING' });

    res.status(200).json({
      success: true,
      stats: { totalLeaks, criticalCount, pendingCount }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;

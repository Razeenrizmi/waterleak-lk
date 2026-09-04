import express from 'express';
import Leak from '../models/Leak.js';
import {
  requireAdmin,
  getPendingReports,
  approveReport,
  rejectReport,
  updateReportStatus,
  getStats,
  getUsers,
  toggleUserBlock
} from '../controllers/adminController.js';

const router = express.Router();

// All admin routes require an authenticated admin (see adminController.requireAdmin)
router.use(requireAdmin);

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

// Member 4: GET /api/admin/reports/pending - Reports waiting for approval
router.get('/reports/pending', getPendingReports);

// Member 4: PATCH /api/admin/reports/:id/approve
router.patch('/reports/:id/approve', approveReport);

// Member 4: PATCH /api/admin/reports/:id/reject
router.patch('/reports/:id/reject', rejectReport);

// Member 4: PATCH /api/admin/reports/:id/status - change status + assign a team
router.patch('/reports/:id/status', updateReportStatus);

// Member 4: GET /api/admin/stats - total, pending, resolved, count by district
router.get('/stats', getStats);

// Member 4: GET /api/admin/users - list users
router.get('/users', getUsers);

// Member 4: PATCH /api/admin/users/:id/block - toggle block/unblock
router.patch('/users/:id/block', toggleUserBlock);

export default router;

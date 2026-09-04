import Leak from '../models/Leak.js';
import User from '../models/User.js';

/**
 * @desc Member 4: List reports waiting for admin approval
 * @route GET /api/admin/reports/pending
 */
export const getPendingReports = async (req, res) => {
  try {
    const reports = await Leak.find({ approvalStatus: 'pending' }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: reports.length, data: reports });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc Member 4: Approve a pending report
 * @route PATCH /api/admin/reports/:id/approve
 */
export const approveReport = async (req, res) => {
  try {
    const leak = await Leak.findByIdAndUpdate(
      req.params.id,
      { approvalStatus: 'approved', rejectionReason: '' },
      { new: true, runValidators: true }
    );
    if (!leak) {
      return res.status(404).json({ success: false, message: 'Report not found' });
    }
    res.status(200).json({ success: true, data: leak });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * @desc Member 4: Update a report's status and/or assigned team
 * @route PATCH /api/admin/reports/:id/status
 */
export const updateReportStatus = async (req, res) => {
  try {
    const { status, assignedTeam } = req.body;
    const update = {};
    if (status !== undefined) update.status = status;
    if (assignedTeam !== undefined) update.assignedTeam = assignedTeam;

    if (Object.keys(update).length === 0) {
      return res.status(400).json({ success: false, message: 'status or assignedTeam is required' });
    }

    const leak = await Leak.findByIdAndUpdate(req.params.id, update, {
      new: true,
      runValidators: true
    });
    if (!leak) {
      return res.status(404).json({ success: false, message: 'Report not found' });
    }
    res.status(200).json({ success: true, data: leak });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * @desc Member 4: Dashboard stats — totals, pending, resolved, count by district
 * @route GET /api/admin/stats
 */
export const getStats = async (req, res) => {
  try {
    const total = await Leak.countDocuments();
    const pending = await Leak.countDocuments({ approvalStatus: 'pending' });
    const resolved = await Leak.countDocuments({ status: 'RESOLVED' });

    const byDistrictAgg = await Leak.aggregate([
      {
        $group: {
          _id: { $cond: [{ $eq: ['$district', ''] }, 'Unknown', '$district'] },
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);
    const byDistrict = byDistrictAgg.map((d) => ({ district: d._id, count: d.count }));

    res.status(200).json({
      success: true,
      stats: { total, pending, resolved, byDistrict }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc Member 4: List all users
 * @route GET /api/admin/users
 */
export const getUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: users.length, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * @desc Member 4: Toggle a user's blocked state
 * @route PATCH /api/admin/users/:id/block
 */
export const toggleUserBlock = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }
    user.blocked = !user.blocked;
    await user.save();
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * @desc Member 4: Reject a pending report with a reason
 * @route PATCH /api/admin/reports/:id/reject
 */
export const rejectReport = async (req, res) => {
  try {
    const { reason } = req.body;
    if (!reason) {
      return res.status(400).json({ success: false, message: 'Rejection reason is required' });
    }

    const leak = await Leak.findByIdAndUpdate(
      req.params.id,
      { approvalStatus: 'rejected', rejectionReason: reason },
      { new: true, runValidators: true }
    );
    if (!leak) {
      return res.status(404).json({ success: false, message: 'Report not found' });
    }
    res.status(200).json({ success: true, data: leak });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

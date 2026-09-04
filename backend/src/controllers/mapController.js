import Leak from '../models/Leak.js';

// Member 2: Map Controller - Get all leaks for interactive map
export const getAllLeaks = async (req, res) => {
  try {
    const leaks = await Leak.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: leaks.length, data: leaks });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

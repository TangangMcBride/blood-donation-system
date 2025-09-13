import express from 'express';
import protect from '../middleware/auth.js';
import authorize from '../middleware/role.js';

const router = express.Router();

// @desc    Get donor dashboard data
// @route   GET /api/donors/dashboard
// @access  Private (Donors only)
router.get('/dashboard', protect, authorize('Donor'), (req, res) => {
  try {
    res.json({
      message: 'Donor dashboard data',
      user: req.user,
      pendingRequests: 5, // Placeholder - will implement real data later
      completedDonations: 3, // Placeholder
      upcomingAppointments: 2 // Placeholder
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// @desc    Get available blood requests for donor
// @route   GET /api/donors/requests
// @access  Private (Donors only)
router.get('/requests', protect, authorize('Donor'), (req, res) => {
  try {
    res.json({
      message: 'Available blood requests for donor',
      requests: [] // Placeholder - will implement real data later
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

export default router;
import express from 'express';
import protect from '../middleware/auth.js';
import authorize from '../middleware/role.js';

const router = express.Router();

// @desc    Create a new blood request
// @route   POST /api/requests
// @access  Private (Hospitals only)
router.post('/', protect, authorize('Hospital'), (req, res) => {
  try {
    res.json({
      message: 'Blood request created successfully',
      request: req.body // Placeholder - will implement real logic later
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// @desc    Get all blood requests
// @route   GET /api/requests
// @access  Private
router.get('/', protect, (req, res) => {
  try {
    res.json({
      message: 'List of blood requests',
      requests: [] // Placeholder - will implement real data later
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

export default router;
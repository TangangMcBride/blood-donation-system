import User from '../models/User.js';

// @desc    Get user by ID
// @route   GET /api/users/:id
// @access  Private
export const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({
        message: 'User not found',
      });
    }
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      // Check if the new email is already taken by another user
      if (req.body.email && req.body.email !== user.email) {
        const emailExists = await User.findOne({ email: req.body.email });
        if (emailExists) {
          return res.status(400).json({
            message: 'Email already taken',
          });
        }
      }

      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      user.phone = req.body.phone || user.phone;
      user.bloodType = req.body.bloodType || user.bloodType;
      user.location = req.body.location || user.location;
      user.availability = req.body.availability !== undefined ? req.body.availability : user.availability;

      if (req.body.password) {
        if (req.body.password.length < 6) {
          return res.status(400).json({
            message: 'Password must be at least 6 characters',
          });
        }
        user.password = req.body.password;
      }

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        bloodType: updatedUser.bloodType,
        phone: updatedUser.phone,
        location: updatedUser.location,
        availability: updatedUser.availability,
      });
    } else {
      res.status(404).json({
        message: 'User not found',
      });
    }
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
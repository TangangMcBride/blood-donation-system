import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const protect = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        message: 'Not authorized, no token provided',
      });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id).select('-password');
      
      if (!user || !user.isActive) {
        return res.status(401).json({
          message: 'Not authorized, user not found or inactive',
        });
      }

      req.user = user;
      next();
    } catch (error) {
      return res.status(401).json({
        message: 'Not authorized, token failed',
      });
    }
  } catch (error) {
    next(error);
  }
};

export default protect;
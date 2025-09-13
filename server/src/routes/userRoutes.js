import express from 'express';
import { getUser, updateProfile } from '../controllers/userController.js';
import protect from '../middleware/auth.js';

const router = express.Router();

router.get('/:id', protect, getUser);
router.put('/profile', protect, updateProfile);

export default router;
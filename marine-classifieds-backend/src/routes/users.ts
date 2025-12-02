import express from 'express';
import { getUserProfile, updateUserProfile, deleteUser, getUsers } from '../controllers/user.controller';
import { protect } from '../middleware/auth';
import { isAdmin } from '../middleware/admin';

const router = express.Router();

// User profile routes
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);
router.delete('/profile', protect, deleteUser);

// Admin routes
router.get('/', protect, isAdmin, getUsers);

export default router; 
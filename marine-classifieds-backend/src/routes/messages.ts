import express from 'express';
import { protect } from '../middleware/auth';
import { getMessages, sendMessage, getMessageById, deleteMessage, getNotifications } from '../controllers/messages.controller';

const router = express.Router();

router.get('/', protect, getMessages); // Get all messages for user
router.post('/', protect, sendMessage); // Send a message
router.get('/:id', protect, getMessageById); // Get a specific message
router.delete('/:id', protect, deleteMessage); // Delete a message
router.get('/notifications/all', protect, getNotifications); // Get notifications for user

export default router; 
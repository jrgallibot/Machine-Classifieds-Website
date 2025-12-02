import express from 'express';
import { createPayment, getPaymentHistory, processWebhook, createPayPalPayment, handlePayPalWebhook } from '../controllers/payment.controller';
import { protect } from '../middleware/auth';

const router = express.Router();

// Payment routes
router.post('/create', protect, createPayment);
router.get('/history', protect, getPaymentHistory);
router.post('/webhook', processWebhook);
router.post('/paypal/create', protect, createPayPalPayment);
router.post('/paypal/webhook', handlePayPalWebhook);

export default router; 
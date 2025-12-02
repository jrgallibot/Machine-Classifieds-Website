import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { validateRegister, validateLogin } from '../middleware/validators';
import { protect } from '../middleware/auth';
import { verifyEmail } from '../controllers/auth.controller';

const router = Router();
const authController = new AuthController();

// @route   POST /api/auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', validateRegister, authController.register.bind(authController));

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', validateLogin, authController.login.bind(authController));

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', protect, authController.getMe.bind(authController));

// @route   POST /api/auth/forgot-password
// @desc    Forgot password
// @access  Public
router.post('/forgot-password', authController.forgotPassword.bind(authController));

// @route   POST /api/auth/reset-password
// @desc    Reset password
// @access  Public
router.post('/reset-password', authController.resetPassword.bind(authController));

// @route   GET /api/auth/verify-email
// @desc    Verify email
// @access  Public
router.get('/verify-email', verifyEmail);

export default router; 
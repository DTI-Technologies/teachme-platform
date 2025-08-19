import { Router } from 'express';
import { body } from 'express-validator';
import { asyncHandler } from '../middleware/errorHandler';
import { AuthController } from '../controllers/AuthController';

const router = Router();
const authController = new AuthController();

// Validation rules
const loginValidation = [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 8 }),
];

const registerValidation = [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 8 }).matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/),
  body('firstName').isLength({ min: 1, max: 50 }).trim(),
  body('lastName').isLength({ min: 1, max: 50 }).trim(),
  body('role').isIn(['student', 'teacher', 'parent', 'admin']),
];

const forgotPasswordValidation = [
  body('email').isEmail().normalizeEmail(),
];

const resetPasswordValidation = [
  body('token').isLength({ min: 1 }),
  body('password').isLength({ min: 8 }).matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/),
];

// Routes
router.post('/login', loginValidation, asyncHandler(authController.login));
router.post('/register', registerValidation, asyncHandler(authController.register));
router.post('/logout', asyncHandler(authController.logout));
router.post('/refresh', asyncHandler(authController.refreshToken));
router.post('/forgot-password', forgotPasswordValidation, asyncHandler(authController.forgotPassword));
router.post('/reset-password', resetPasswordValidation, asyncHandler(authController.resetPassword));
router.post('/verify-email', asyncHandler(authController.verifyEmail));

export default router;

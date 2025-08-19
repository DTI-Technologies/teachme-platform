import { Router } from 'express';
import { body, param } from 'express-validator';
import { asyncHandler } from '../middleware/errorHandler';
import { requireRole, requireOwnership } from '../middleware/auth';
import { UserController } from '../controllers/UserController';
// import { UserRole } from '@teachme/shared';

enum UserRole {
  STUDENT = 'student',
  TEACHER = 'teacher',
  PARENT = 'parent',
  ADMIN = 'admin',
  SUPER_ADMIN = 'super_admin',
}

const router = Router();
const userController = new UserController();

// Validation rules
const updateProfileValidation = [
  body('firstName').optional().isLength({ min: 1, max: 50 }).trim(),
  body('lastName').optional().isLength({ min: 1, max: 50 }).trim(),
  body('avatar').optional().isURL(),
];

const updatePreferencesValidation = [
  body('theme').optional().isIn(['light', 'dark', 'auto']),
  body('language').optional().isLength({ min: 2, max: 5 }),
  body('notifications').optional().isObject(),
  body('accessibility').optional().isObject(),
];

const userIdValidation = [
  param('id').isUUID(),
];

// Routes
router.get('/profile', asyncHandler(userController.getProfile));
router.put('/profile', updateProfileValidation, asyncHandler(userController.updateProfile));
router.get('/preferences', asyncHandler(userController.getPreferences));
router.put('/preferences', updatePreferencesValidation, asyncHandler(userController.updatePreferences));

// Admin routes
router.get('/', requireRole(UserRole.ADMIN), asyncHandler(userController.getUsers));
router.get('/:id', userIdValidation, requireRole(UserRole.ADMIN), asyncHandler(userController.getUserById));
router.put('/:id', userIdValidation, updateProfileValidation, requireRole(UserRole.ADMIN), asyncHandler(userController.updateUser));
router.delete('/:id', userIdValidation, requireRole(UserRole.ADMIN), asyncHandler(userController.deleteUser));

export default router;

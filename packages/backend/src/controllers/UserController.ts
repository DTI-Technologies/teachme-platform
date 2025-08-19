import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { getDocument, updateDocument, queryDocuments } from '../config/firebase';
import { logger, logBusiness } from '../utils/logger';
import { ValidationError, NotFoundError } from '../middleware/errorHandler';

export class UserController {
  async getProfile(req: Request, res: Response) {
    if (!req.user) {
      throw new Error('User not authenticated');
    }

    try {
      const userProfile = await getDocument('users', req.user.uid);
      
      if (!userProfile) {
        throw new NotFoundError('User profile not found');
      }

      res.json({
        success: true,
        data: {
          id: userProfile.id,
          email: userProfile.email,
          firstName: userProfile.firstName,
          lastName: userProfile.lastName,
          role: userProfile.role,
          avatar: userProfile.avatar,
          preferences: userProfile.preferences,
          createdAt: userProfile.createdAt,
          updatedAt: userProfile.updatedAt,
        },
      });
    } catch (error) {
      logger.error('Get profile failed:', error);
      throw error;
    }
  }

  async updateProfile(req: Request, res: Response) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ValidationError('Invalid input data');
    }

    if (!req.user) {
      throw new Error('User not authenticated');
    }

    const { firstName, lastName, avatar } = req.body;

    try {
      const updateData: any = {
        updatedAt: new Date(),
      };

      if (firstName) updateData.firstName = firstName;
      if (lastName) updateData.lastName = lastName;
      if (avatar) updateData.avatar = avatar;

      await updateDocument('users', req.user.uid, updateData);

      logBusiness('Profile updated', req.user.uid, updateData);

      res.json({
        success: true,
        message: 'Profile updated successfully',
      });
    } catch (error) {
      logger.error('Update profile failed:', error);
      throw error;
    }
  }

  async getPreferences(req: Request, res: Response) {
    if (!req.user) {
      throw new Error('User not authenticated');
    }

    try {
      const userProfile = await getDocument('users', req.user.uid);
      
      if (!userProfile) {
        throw new NotFoundError('User profile not found');
      }

      res.json({
        success: true,
        data: userProfile.preferences || {},
      });
    } catch (error) {
      logger.error('Get preferences failed:', error);
      throw error;
    }
  }

  async updatePreferences(req: Request, res: Response) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ValidationError('Invalid input data');
    }

    if (!req.user) {
      throw new Error('User not authenticated');
    }

    try {
      const userProfile = await getDocument('users', req.user.uid);
      
      if (!userProfile) {
        throw new NotFoundError('User profile not found');
      }

      const updatedPreferences = {
        ...userProfile.preferences,
        ...req.body,
      };

      await updateDocument('users', req.user.uid, {
        preferences: updatedPreferences,
        updatedAt: new Date(),
      });

      logBusiness('Preferences updated', req.user.uid, req.body);

      res.json({
        success: true,
        data: updatedPreferences,
        message: 'Preferences updated successfully',
      });
    } catch (error) {
      logger.error('Update preferences failed:', error);
      throw error;
    }
  }

  async getUsers(req: Request, res: Response) {
    // Admin-only endpoint to get all users
    try {
      const users = await queryDocuments('users');

      res.json({
        success: true,
        data: users.map(user => ({
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          isActive: user.isActive,
          createdAt: user.createdAt,
        })),
      });
    } catch (error) {
      logger.error('Get users failed:', error);
      throw error;
    }
  }

  async getUserById(req: Request, res: Response) {
    const { id } = req.params;

    try {
      const userProfile = await getDocument('users', id);
      
      if (!userProfile) {
        throw new NotFoundError('User not found');
      }

      res.json({
        success: true,
        data: {
          id: userProfile.id,
          email: userProfile.email,
          firstName: userProfile.firstName,
          lastName: userProfile.lastName,
          role: userProfile.role,
          avatar: userProfile.avatar,
          isActive: userProfile.isActive,
          createdAt: userProfile.createdAt,
          updatedAt: userProfile.updatedAt,
        },
      });
    } catch (error) {
      logger.error('Get user by ID failed:', error);
      throw error;
    }
  }

  async updateUser(req: Request, res: Response) {
    // Admin-only endpoint to update any user
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new ValidationError('Invalid input data');
    }

    const { id } = req.params;
    const updateData = { ...req.body, updatedAt: new Date() };

    try {
      await updateDocument('users', id, updateData);

      logBusiness('User updated by admin', req.user?.uid, { targetUserId: id, updateData });

      res.json({
        success: true,
        message: 'User updated successfully',
      });
    } catch (error) {
      logger.error('Update user failed:', error);
      throw error;
    }
  }

  async deleteUser(req: Request, res: Response) {
    // Admin-only endpoint to delete a user
    const { id } = req.params;

    try {
      await updateDocument('users', id, {
        isActive: false,
        deletedAt: new Date(),
        updatedAt: new Date(),
      });

      logBusiness('User deleted by admin', req.user?.uid, { targetUserId: id });

      res.json({
        success: true,
        message: 'User deleted successfully',
      });
    } catch (error) {
      logger.error('Delete user failed:', error);
      throw error;
    }
  }
}

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { verifyIdToken } from '../config/firebase';
import { logger, logSecurity } from '../utils/logger';
// import { UserRole } from '@teachme/shared';

enum UserRole {
  STUDENT = 'student',
  TEACHER = 'teacher',
  PARENT = 'parent',
  ADMIN = 'admin',
  SUPER_ADMIN = 'super_admin',
}

// Extend Request interface to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        uid: string;
        email: string;
        role: UserRole;
        schoolId?: string;
      };
    }
  }
}

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      logSecurity('Missing or invalid authorization header', undefined, { 
        ip: req.ip, 
        userAgent: req.get('User-Agent') 
      });
      return res.status(401).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Authorization token required',
        },
      });
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    try {
      // Try to verify as Firebase ID token first
      const decodedToken = await verifyIdToken(token);
      
      // Get user data from Firestore or your database
      // For now, we'll use the token data directly
      req.user = {
        uid: decodedToken.uid,
        email: decodedToken.email || '',
        role: decodedToken.role || UserRole.STUDENT,
        schoolId: decodedToken.schoolId,
      };

      next();
    } catch (firebaseError) {
      // If Firebase token verification fails, try JWT
      try {
        const jwtSecret = process.env.JWT_SECRET;
        if (!jwtSecret) {
          throw new Error('JWT secret not configured');
        }

        const decoded = jwt.verify(token, jwtSecret) as any;
        req.user = {
          uid: decoded.uid,
          email: decoded.email,
          role: decoded.role,
          schoolId: decoded.schoolId,
        };

        next();
      } catch (jwtError) {
        logSecurity('Token verification failed', undefined, { 
          ip: req.ip, 
          userAgent: req.get('User-Agent'),
          error: jwtError 
        });
        return res.status(401).json({
          success: false,
          error: {
            code: 'INVALID_TOKEN',
            message: 'Invalid or expired token',
          },
        });
      }
    }
  } catch (error) {
    logger.error('Auth middleware error:', error);
    return res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Authentication error',
      },
    });
  }
};

// Role-based authorization middleware
export const requireRole = (requiredRole: UserRole) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Authentication required',
        },
      });
    }

    const roleHierarchy: Record<UserRole, number> = {
      [UserRole.STUDENT]: 1,
      [UserRole.PARENT]: 2,
      [UserRole.TEACHER]: 3,
      [UserRole.ADMIN]: 4,
      [UserRole.SUPER_ADMIN]: 5,
    };

    const userRoleLevel = roleHierarchy[req.user.role];
    const requiredRoleLevel = roleHierarchy[requiredRole];

    if (userRoleLevel < requiredRoleLevel) {
      logSecurity('Insufficient permissions', req.user.uid, {
        userRole: req.user.role,
        requiredRole,
        resource: req.path,
      });
      return res.status(403).json({
        success: false,
        error: {
          code: 'INSUFFICIENT_PERMISSIONS',
          message: 'Insufficient permissions to access this resource',
        },
      });
    }

    next();
  };
};

// School-based authorization middleware
export const requireSameSchool = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      error: {
        code: 'UNAUTHORIZED',
        message: 'Authentication required',
      },
    });
  }

  // Super admins can access any school
  if (req.user.role === UserRole.SUPER_ADMIN) {
    return next();
  }

  const schoolId = req.params.schoolId || req.body.schoolId || req.query.schoolId;
  
  if (schoolId && req.user.schoolId !== schoolId) {
    logSecurity('Cross-school access attempt', req.user.uid, {
      userSchoolId: req.user.schoolId,
      requestedSchoolId: schoolId,
      resource: req.path,
    });
    return res.status(403).json({
      success: false,
      error: {
        code: 'ACCESS_DENIED',
        message: 'Access denied to this school resource',
      },
    });
  }

  next();
};

// Resource ownership middleware
export const requireOwnership = (resourceUserIdField = 'userId') => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: {
          code: 'UNAUTHORIZED',
          message: 'Authentication required',
        },
      });
    }

    // Super admins and admins can access any resource
    if (req.user.role === UserRole.SUPER_ADMIN || req.user.role === UserRole.ADMIN) {
      return next();
    }

    const resourceUserId = req.params[resourceUserIdField] || req.body[resourceUserIdField];
    
    if (resourceUserId && req.user.uid !== resourceUserId) {
      logSecurity('Unauthorized resource access attempt', req.user.uid, {
        resourceUserId,
        resource: req.path,
      });
      return res.status(403).json({
        success: false,
        error: {
          code: 'ACCESS_DENIED',
          message: 'Access denied to this resource',
        },
      });
    }

    next();
  };
};

// Optional authentication middleware (for public endpoints that can benefit from user context)
export const optionalAuth = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(); // Continue without authentication
  }

  try {
    const token = authHeader.substring(7);
    const decodedToken = await verifyIdToken(token);
    
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email || '',
      role: decodedToken.role || UserRole.STUDENT,
      schoolId: decodedToken.schoolId,
    };
  } catch (error) {
    // Ignore authentication errors for optional auth
    logger.debug('Optional auth failed:', error);
  }

  next();
};

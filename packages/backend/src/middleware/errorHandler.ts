import { Request, Response, NextFunction } from 'express';
import { logger, logError } from '../utils/logger';
// import { ApiError } from '@teachme/shared';

interface ApiError {
  code: string;
  message: string;
  details?: Record<string, any>;
}

export interface AppError extends Error {
  statusCode?: number;
  code?: string;
  isOperational?: boolean;
}

export const errorHandler = (
  error: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Log the error
  logError('Request error', error, {
    method: req.method,
    url: req.url,
    body: req.body,
    params: req.params,
    query: req.query,
    user: req.user?.uid,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
  });

  // Default error values
  let statusCode = error.statusCode || 500;
  let code = error.code || 'INTERNAL_SERVER_ERROR';
  let message = error.message || 'An unexpected error occurred';

  // Handle specific error types
  if (error.name === 'ValidationError') {
    statusCode = 400;
    code = 'VALIDATION_ERROR';
    message = 'Invalid input data';
  } else if (error.name === 'CastError') {
    statusCode = 400;
    code = 'INVALID_INPUT';
    message = 'Invalid data format';
  } else if (error.name === 'MongoError' && (error as any).code === 11000) {
    statusCode = 409;
    code = 'RESOURCE_ALREADY_EXISTS';
    message = 'Resource already exists';
  } else if (error.name === 'JsonWebTokenError') {
    statusCode = 401;
    code = 'INVALID_TOKEN';
    message = 'Invalid authentication token';
  } else if (error.name === 'TokenExpiredError') {
    statusCode = 401;
    code = 'TOKEN_EXPIRED';
    message = 'Authentication token has expired';
  } else if (error.name === 'MulterError') {
    statusCode = 400;
    code = 'FILE_UPLOAD_ERROR';
    message = 'File upload error';
  }

  // Don't expose internal errors in production
  if (process.env.NODE_ENV === 'production' && statusCode === 500) {
    message = 'Internal server error';
  }

  const apiError: ApiError = {
    code,
    message,
    details: process.env.NODE_ENV === 'development' ? {
      stack: error.stack,
      name: error.name,
    } : undefined,
  };

  res.status(statusCode).json({
    success: false,
    error: apiError,
    timestamp: new Date().toISOString(),
  });
};

// Async error wrapper
export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// Custom error classes
export class ValidationError extends Error {
  statusCode = 400;
  code = 'VALIDATION_ERROR';
  isOperational = true;

  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export class NotFoundError extends Error {
  statusCode = 404;
  code = 'RESOURCE_NOT_FOUND';
  isOperational = true;

  constructor(message: string = 'Resource not found') {
    super(message);
    this.name = 'NotFoundError';
  }
}

export class UnauthorizedError extends Error {
  statusCode = 401;
  code = 'UNAUTHORIZED';
  isOperational = true;

  constructor(message: string = 'Unauthorized access') {
    super(message);
    this.name = 'UnauthorizedError';
  }
}

export class ForbiddenError extends Error {
  statusCode = 403;
  code = 'FORBIDDEN';
  isOperational = true;

  constructor(message: string = 'Access forbidden') {
    super(message);
    this.name = 'ForbiddenError';
  }
}

export class ConflictError extends Error {
  statusCode = 409;
  code = 'CONFLICT';
  isOperational = true;

  constructor(message: string = 'Resource conflict') {
    super(message);
    this.name = 'ConflictError';
  }
}

export class RateLimitError extends Error {
  statusCode = 429;
  code = 'RATE_LIMIT_EXCEEDED';
  isOperational = true;

  constructor(message: string = 'Rate limit exceeded') {
    super(message);
    this.name = 'RateLimitError';
  }
}

export class ServiceUnavailableError extends Error {
  statusCode = 503;
  code = 'SERVICE_UNAVAILABLE';
  isOperational = true;

  constructor(message: string = 'Service temporarily unavailable') {
    super(message);
    this.name = 'ServiceUnavailableError';
  }
}

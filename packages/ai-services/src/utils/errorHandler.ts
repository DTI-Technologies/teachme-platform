import { Request, Response, NextFunction } from 'express';
import { logger } from './logger';

export interface AIError extends Error {
  statusCode?: number;
  code?: string;
}

export const errorHandler = (
  error: AIError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.error('AI Service Error:', {
    error: error.message,
    stack: error.stack,
    method: req.method,
    url: req.url,
    body: req.body,
  });

  let statusCode = error.statusCode || 500;
  let code = error.code || 'AI_SERVICE_ERROR';
  let message = error.message || 'AI service error occurred';

  // Handle specific OpenAI errors
  if (error.message.includes('API key')) {
    statusCode = 401;
    code = 'INVALID_API_KEY';
    message = 'Invalid or missing API key';
  } else if (error.message.includes('quota')) {
    statusCode = 429;
    code = 'QUOTA_EXCEEDED';
    message = 'API quota exceeded';
  } else if (error.message.includes('rate limit')) {
    statusCode = 429;
    code = 'RATE_LIMIT_EXCEEDED';
    message = 'Rate limit exceeded';
  }

  res.status(statusCode).json({
    success: false,
    error: {
      code,
      message,
      details: process.env.NODE_ENV === 'development' ? {
        stack: error.stack,
      } : undefined,
    },
    timestamp: new Date().toISOString(),
  });
};

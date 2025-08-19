import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

export const notFoundHandler = (req: Request, res: Response, next: NextFunction) => {
  logger.warn(`404 - Route not found: ${req.method} ${req.originalUrl}`, {
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    user: req.user?.uid,
  });

  res.status(404).json({
    success: false,
    error: {
      code: 'ROUTE_NOT_FOUND',
      message: `Route ${req.method} ${req.originalUrl} not found`,
    },
    timestamp: new Date().toISOString(),
  });
};

import winston from 'winston';

// Define log levels
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

// Define colors for each level
const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white',
};

// Tell winston that you want to link the colors
winston.addColors(colors);

// Define which level to log based on environment
const level = (): string => {
  const env = process.env.NODE_ENV || 'development';
  const isDevelopment = env === 'development';
  return isDevelopment ? 'debug' : 'warn';
};

// Define different log formats
const format = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
  winston.format.colorize({ all: true }),
  winston.format.printf(
    (info) => `${info.timestamp} ${info.level}: ${info.message}`,
  ),
);

// Define which transports the logger must use
const transports = [
  // Console transport
  new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple()
    ),
  }),
  
  // File transport for errors
  new winston.transports.File({
    filename: 'logs/error.log',
    level: 'error',
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json()
    ),
  }),
  
  // File transport for all logs
  new winston.transports.File({
    filename: 'logs/combined.log',
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json()
    ),
  }),
];

// Create the logger
export const logger = winston.createLogger({
  level: level(),
  levels,
  format,
  transports,
  exitOnError: false,
});

// Create a stream object for Morgan HTTP logger
export const morganStream = {
  write: (message: string) => {
    logger.http(message.substring(0, message.lastIndexOf('\n')));
  },
};

// Helper functions for structured logging
export const logError = (message: string, error?: Error, metadata?: any) => {
  logger.error(message, {
    error: error ? {
      message: error.message,
      stack: error.stack,
      name: error.name,
    } : undefined,
    metadata,
  });
};

export const logInfo = (message: string, metadata?: any) => {
  logger.info(message, { metadata });
};

export const logWarn = (message: string, metadata?: any) => {
  logger.warn(message, { metadata });
};

export const logDebug = (message: string, metadata?: any) => {
  logger.debug(message, { metadata });
};

// Performance logging
export const logPerformance = (operation: string, startTime: number, metadata?: any) => {
  const duration = Date.now() - startTime;
  logger.info(`Performance: ${operation} completed in ${duration}ms`, {
    operation,
    duration,
    metadata,
  });
};

// Request logging
export const logRequest = (req: any, res: any, metadata?: any) => {
  logger.http(`${req.method} ${req.url}`, {
    method: req.method,
    url: req.url,
    statusCode: res.statusCode,
    userAgent: req.get('User-Agent'),
    ip: req.ip,
    metadata,
  });
};

// Security logging
export const logSecurity = (event: string, userId?: string, metadata?: any) => {
  logger.warn(`Security Event: ${event}`, {
    event,
    userId,
    timestamp: new Date().toISOString(),
    metadata,
  });
};

// Business logic logging
export const logBusiness = (event: string, userId?: string, metadata?: any) => {
  logger.info(`Business Event: ${event}`, {
    event,
    userId,
    timestamp: new Date().toISOString(),
    metadata,
  });
};

export default logger;

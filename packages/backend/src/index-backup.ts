// Backup of original index.ts
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

import { errorHandler } from './middleware/errorHandler';
import { notFoundHandler } from './middleware/notFoundHandler';
import { authMiddleware } from './middleware/auth';
import { logger } from './utils/logger';
import { connectDatabase } from './config/database';
import { initializeFirebase } from './config/firebase';

// Import routes
import authRoutes from './routes/auth';
import userRoutes from './routes/users';
import studentRoutes from './routes/students';
import teacherRoutes from './routes/teachers';
import lessonRoutes from './routes/lessons';
import assessmentRoutes from './routes/assessments';
import aiRoutes from './routes/ai';
import schoolRoutes from './routes/schools';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3000'],
  credentials: true,
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Compression middleware
app.use(compression());

// Logging middleware
app.use(morgan('combined', {
  stream: {
    write: (message: string) => logger.info(message.trim()),
  },
}));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/users', authMiddleware, userRoutes);
app.use('/api/students', authMiddleware, studentRoutes);
app.use('/api/teachers', authMiddleware, teacherRoutes);
app.use('/api/lessons', authMiddleware, lessonRoutes);
app.use('/api/assessments', authMiddleware, assessmentRoutes);
app.use('/api/ai', authMiddleware, aiRoutes);
app.use('/api/schools', authMiddleware, schoolRoutes);

// Error handling middleware (must be last)
app.use(notFoundHandler);
app.use(errorHandler);

// Initialize services
async function startServer() {
  try {
    // Initialize Firebase
    await initializeFirebase();
    logger.info('Firebase initialized successfully');

    // Connect to database
    await connectDatabase();
    logger.info('Database connected successfully');

    // Start server
    app.listen(PORT, () => {
      logger.info(`🚀 TeachMe Backend API server running on port ${PORT}`);
      logger.info(`📍 Health check: http://localhost:${PORT}/health`);
      logger.info(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

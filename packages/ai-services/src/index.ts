import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';

import { logger } from './utils/logger';
import { errorHandler } from './utils/errorHandler';
import { initializeOpenAI } from './config/openai';

// Import routes
import aiRoutes from './routes/ai';
import lessonRoutes from './routes/lessons';
import assessmentRoutes from './routes/assessments';
import tutorRoutes from './routes/tutor';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.AI_SERVICE_PORT || 8000;

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3001'],
  credentials: true,
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

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
    service: 'AI Services',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// API routes
app.use('/api/ai', aiRoutes);
app.use('/api/lessons', lessonRoutes);
app.use('/api/assessments', assessmentRoutes);
app.use('/api/tutor', tutorRoutes);

// Error handling middleware
app.use(errorHandler);

// Initialize services and start server
async function startServer() {
  try {
    // Initialize OpenAI
    await initializeOpenAI();
    logger.info('OpenAI initialized successfully');

    // Start server
    app.listen(PORT, () => {
      logger.info(`AI Services running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
    });
  } catch (error) {
    logger.error('Failed to start AI services:', error);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGTERM', () => {
  logger.info('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  logger.info('SIGINT received, shutting down gracefully');
  process.exit(0);
});

startServer();

export default app;

import { createClient } from 'redis';
import { logger } from '../utils/logger';

// Redis client for caching and sessions
let redisClient: ReturnType<typeof createClient> | null = null;

export const connectDatabase = async (): Promise<void> => {
  try {
    // Initialize Redis client
    if (process.env.REDIS_URL) {
      redisClient = createClient({
        url: process.env.REDIS_URL,
      });

      redisClient.on('error', (err) => {
        logger.error('Redis Client Error:', err);
      });

      redisClient.on('connect', () => {
        logger.info('Redis client connected');
      });

      redisClient.on('ready', () => {
        logger.info('Redis client ready');
      });

      await redisClient.connect();
    } else {
      logger.warn('Redis URL not provided, running without Redis cache');
    }

    logger.info('Database connections established');
  } catch (error) {
    logger.error('Database connection failed:', error);
    throw error;
  }
};

export const getRedisClient = () => {
  if (!redisClient) {
    throw new Error('Redis client not initialized');
  }
  return redisClient;
};

export const disconnectDatabase = async (): Promise<void> => {
  try {
    if (redisClient) {
      await redisClient.quit();
      logger.info('Redis client disconnected');
    }
  } catch (error) {
    logger.error('Error disconnecting from database:', error);
  }
};

// Cache utilities
export const cache = {
  get: async (key: string): Promise<string | null> => {
    if (!redisClient) return null;
    try {
      return await redisClient.get(key);
    } catch (error) {
      logger.error('Cache get error:', error);
      return null;
    }
  },

  set: async (key: string, value: string, ttl?: number): Promise<void> => {
    if (!redisClient) return;
    try {
      if (ttl) {
        await redisClient.setEx(key, ttl, value);
      } else {
        await redisClient.set(key, value);
      }
    } catch (error) {
      logger.error('Cache set error:', error);
    }
  },

  del: async (key: string): Promise<void> => {
    if (!redisClient) return;
    try {
      await redisClient.del(key);
    } catch (error) {
      logger.error('Cache delete error:', error);
    }
  },

  exists: async (key: string): Promise<boolean> => {
    if (!redisClient) return false;
    try {
      const result = await redisClient.exists(key);
      return result === 1;
    } catch (error) {
      logger.error('Cache exists error:', error);
      return false;
    }
  },

  flush: async (): Promise<void> => {
    if (!redisClient) return;
    try {
      await redisClient.flushAll();
    } catch (error) {
      logger.error('Cache flush error:', error);
    }
  },
};

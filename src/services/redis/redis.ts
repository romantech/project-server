import Redis from 'ioredis';
import {
  isProd,
  logger,
  REDIS_HOST,
  REDIS_PASSWORD,
  REDIS_PORT,
  REDIS_USERNAME,
} from '@/config';

export const redis = new Redis({
  host: REDIS_HOST,
  port: REDIS_PORT,
  username: REDIS_USERNAME,
  password: REDIS_PASSWORD,
});

redis.on('connect', () => {
  const suffix = isProd() ? 'prod' : 'dev';
  redis.client('SETNAME', `project-server-${suffix}`);
  logger.info('Successfully connected to Redis');
});

redis.on('ready', () => {
  logger.info('Redis is ready for use');
});

redis.on('error', (error) => {
  logger.error('Error connecting to Redis:', error);
});

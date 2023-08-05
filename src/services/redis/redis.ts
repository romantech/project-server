import Redis from 'ioredis';
import { REDIS_HOST, REDIS_PASSWORD, REDIS_PORT } from '@/config';

export const redis = new Redis({
  host: REDIS_HOST,
  port: REDIS_PORT,
  password: REDIS_PASSWORD,
});

redis.on('connect', () => {
  console.log('Successfully connected to Redis');
});

redis.on('ready', () => {
  console.log('Redis is ready for use');
});

redis.on('error', (error) => {
  console.error('Error connecting to Redis:', error);
});

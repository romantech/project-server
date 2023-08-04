import Redis from 'ioredis';
import { REDIS_HOST, REDIS_PASSWORD, REDIS_PORT } from '@/config';

const redisClient = new Redis({
  host: REDIS_HOST,
  port: REDIS_PORT,
  password: REDIS_PASSWORD,
});

redisClient.on('connect', () => {
  console.log('Successfully connected to Redis');
});

redisClient.on('ready', () => {
  console.log('Redis is ready for use');
});

redisClient.on('error', (error) => {
  console.error('Error connecting to Redis:', error);
});

export default redisClient;

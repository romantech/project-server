import Redis from 'ioredis';
import {
  isProd,
  REDIS_HOST,
  REDIS_PASSWORD,
  REDIS_PORT,
  REDIS_USERNAME,
} from '@/config';
import { COLORS } from '@/constants';

const { success, failed } = COLORS;

export const redis = new Redis({
  host: REDIS_HOST,
  port: REDIS_PORT,
  username: REDIS_USERNAME,
  password: REDIS_PASSWORD,
});

redis.on('connect', () => {
  const suffix = isProd() ? 'prod' : 'dev';
  redis.client('SETNAME', `project-server-${suffix}`);
  console.log(success, 'Successfully connected to Redis');
});

redis.on('ready', () => {
  console.log(success, 'Redis is ready for use');
});

redis.on('error', (error) => {
  console.error(failed, 'Error connecting to Redis:', error);
});

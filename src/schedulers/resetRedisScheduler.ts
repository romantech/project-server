import { ANALYSIS_REDIS_KEYS, INIT_TOTAL_COUNT, redis } from '@/services';
import schedule from 'node-schedule';

const resetRedisKeyAtMidnight = () => {
  redis.set(ANALYSIS_REDIS_KEYS.TOTAL_COUNT, INIT_TOTAL_COUNT);
};

export const scheduleRedisReset = () => {
  schedule.scheduleJob('30 9 * * *', resetRedisKeyAtMidnight);
};

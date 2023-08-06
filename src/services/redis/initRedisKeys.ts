import Redis from 'ioredis';
import { ANALYSIS_REDIS_KEYS } from '@/services';

export const INIT_TOTAL_COUNT = 50;
const EXP_PERIOD = 24 * 60 * 60;

export const initRedisKeys = async (redisClient: Redis) => {
  const { TOTAL_COUNT } = ANALYSIS_REDIS_KEYS;
  const initAnalysisService = async () => {
    const totalCount = await redisClient.get(TOTAL_COUNT);

    if (totalCount === null) {
      await redisClient.set(TOTAL_COUNT, INIT_TOTAL_COUNT, 'EX', EXP_PERIOD);
    }
  };

  await initAnalysisService();
};
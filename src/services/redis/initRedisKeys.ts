import Redis from 'ioredis';
import { ANALYSIS_REDIS_KEYS, ANALYSIS_TOTAL_INIT_COUNT } from '@/services';

export const initRedisKeys = async (redis: Redis) => {
  const { TOTAL_COUNT } = ANALYSIS_REDIS_KEYS;

  const initAnalysisService = async () => {
    const totalCount = await redis.get(TOTAL_COUNT);
    if (!totalCount) await redis.set(TOTAL_COUNT, ANALYSIS_TOTAL_INIT_COUNT);
  };

  await initAnalysisService();
};

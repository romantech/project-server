import Redis from 'ioredis';
import { ANALYSIS_MAX_INIT_COUNT, ANALYSIS_REDIS_KEYS } from '@/services';

export const initRedisKeys = async (redis: Redis) => {
  const { TOTAL_COUNT } = ANALYSIS_REDIS_KEYS;

  const initAnalysisService = async () => {
    const totalCount = await redis.get(TOTAL_COUNT);
    if (!totalCount) await redis.set(TOTAL_COUNT, ANALYSIS_MAX_INIT_COUNT);
  };

  await initAnalysisService();
};

import Redis from 'ioredis';
import { ANALYSIS_REDIS_KEYS, ANALYSIS_TOTAL_INIT_COUNT } from '@/services';

export const initRedisKeys = async (redisClient: Redis) => {
  const { TOTAL_COUNT } = ANALYSIS_REDIS_KEYS;
  const initAnalysisService = async () => {
    const totalCount = await redisClient.get(TOTAL_COUNT);

    if (totalCount === null) {
      await redisClient.set(TOTAL_COUNT, ANALYSIS_TOTAL_INIT_COUNT);
    }
  };

  await initAnalysisService();
};

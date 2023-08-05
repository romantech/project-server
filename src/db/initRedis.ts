import Redis from 'ioredis';
import { ANALYSIS_REDIS_KEYS } from '@/utils/redisKeys';

const { TOTAL_COUNT } = ANALYSIS_REDIS_KEYS;
const INIT_COUNT = 50;
const EXP_PERIOD = 24 * 60 * 60;

export const initRedis = async (redisClient: Redis) => {
  const initSyntaxAnalyzer = async () => {
    const totalCount = await redisClient.get(TOTAL_COUNT);

    if (totalCount === null) {
      await redisClient.set(TOTAL_COUNT, INIT_COUNT, 'EX', EXP_PERIOD);
    }
  };

  await initSyntaxAnalyzer();
};

import Redis from 'ioredis';
import { ANALYSIS_INIT_COUNTS, ANALYSIS_KEYS } from '@/services';

const initializeAnalysisKeys = async (redis: Redis) => {
  const { ANALYSIS, RANDOM_SENTENCE } = ANALYSIS_INIT_COUNTS;
  const { KEYS, FIELDS } = ANALYSIS_KEYS;

  const [analysis, randomSentence] = await redis.hmget(
    KEYS.REMAINING.TOTAL,
    FIELDS.ANALYSIS,
    FIELDS.RANDOM_SENTENCE,
  );

  const updates: Record<string, number> = {};

  if (!analysis) updates[FIELDS.ANALYSIS] = ANALYSIS.TOTAL;
  if (!randomSentence) updates[FIELDS.RANDOM_SENTENCE] = RANDOM_SENTENCE.TOTAL;

  const shouldUpdate = Object.keys(updates).length;
  if (shouldUpdate) return redis.hmset(KEYS.REMAINING.TOTAL, updates);
};

export const initRedisKeys = async (redis: Redis) => {
  await initializeAnalysisKeys(redis);
};

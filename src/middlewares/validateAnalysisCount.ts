import { ANALYSIS_REDIS_KEYS, redis } from '@/services';
import { throwCustomError } from '@/utils';

const { TOTAL_COUNT, COUNT_BY_ID } = ANALYSIS_REDIS_KEYS;

export async function validateAnalysisCount(fingerprint: string) {
  const [total, countById] = await redis.mget(
    TOTAL_COUNT,
    COUNT_BY_ID(fingerprint),
  );

  if (!total || !countById) {
    throwCustomError('No remaining analysis count available.', 400);
  }
}

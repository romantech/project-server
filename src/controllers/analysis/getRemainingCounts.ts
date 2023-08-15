import {
  ANALYSIS_INIT_COUNTS,
  ANALYSIS_KEY_EXP,
  AnalyzerFieldType,
  redis,
  REDIS_ANALYZER,
} from '@/services';
import { asyncHandler, throwCustomError } from '@/utils';
import { validateClientIP } from '@/middlewares';

const { ANALYSIS, RANDOM_SENTENCE } = ANALYSIS_INIT_COUNTS;
const { KEYS, FIELDS } = REDIS_ANALYZER;

export const getRemainingCounts = [
  validateClientIP,
  asyncHandler(async (req, res) => {
    const clientIP = req.clientIP as string; // validateClientIP 미들웨어에서 검증하므로 항상 존재

    const total = await getTotalCounts(KEYS.REMAINING.TOTAL);
    const userTotal = await getCountsByIP(clientIP, total);

    res.status(200).json(userTotal);
  }),
];

const getTotalCounts = async (key: string) => {
  const result = await redis.hgetall(key);

  const missingFields = Object.values(FIELDS).filter(
    (field) => !(field in result),
  );

  if (missingFields.length > 0) {
    const fieldNames = missingFields.join(', ');
    throwCustomError(
      `Invalid counts for key: ${key}. Missing fields: ${fieldNames}.`,
      500,
    );
  }

  return result as AnalyzerFieldType;
};

const getCountsByIP = async (clientIP: string, total: AnalyzerFieldType) => {
  const key = KEYS.REMAINING.USER(clientIP);
  const counts = (await redis.hgetall(key)) as AnalyzerFieldType;
  const isNewClient = Object.keys(counts).length === 0;

  const analysis = getSmallestNumber(
    isNewClient ? ANALYSIS.PER_USER : counts.analysis,
    total.analysis,
  );

  const random_sentence = getSmallestNumber(
    isNewClient ? RANDOM_SENTENCE.PER_USER : counts.random_sentence,
    total.random_sentence,
  );

  if (isNewClient) {
    await redis.hmset(key, {
      [FIELDS.ANALYSIS]: analysis,
      [FIELDS.RANDOM_SENTENCE]: random_sentence,
    });
    await redis.expire(key, ANALYSIS_KEY_EXP);
  }

  return { analysis, random_sentence };
};

const getSmallestNumber = (...target: (string | number)[]) => {
  return Math.min(...target.map(Number));
};

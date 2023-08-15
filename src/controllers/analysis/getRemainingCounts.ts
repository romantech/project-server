import {
  ANALYSIS_INIT_COUNTS,
  ANALYSIS_KEY_EXP,
  ANALYSIS_KEYS,
  AnalysisFields,
  redis,
} from '@/services';
import { asyncHandler, throwCustomError } from '@/utils';
import { validateClientIP } from '@/middlewares';

const { ANALYSIS, RANDOM_SENTENCE } = ANALYSIS_INIT_COUNTS;
const { KEYS, FIELDS } = ANALYSIS_KEYS;

export const getRemainingCounts = [
  validateClientIP,
  asyncHandler(async (req, res) => {
    const clientIP = req.clientIP as string; // validateClientIP 미들웨어에서 검증하므로 항상 존재

    const total = await getCounts(KEYS.REMAINING.TOTAL);
    const userTotal = await getCountsByIP(clientIP, total);

    res.status(200).json(userTotal);
  }),
];

const getCounts = async (key: string) => {
  const result = await redis.hgetall(key);

  const isValid = Object.values(FIELDS).every((key) => key in result);

  if (!isValid) {
    throwCustomError(
      `Invalid counts for key: ${key}. Some fields are missing.`,
      500,
    );
  }

  return result as AnalysisFields;
};

const getCountsByIP = async (clientIP: string, total: AnalysisFields) => {
  const key = KEYS.REMAINING.USER(clientIP);
  const counts = await getCounts(key);
  const isNewClient = !counts;

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

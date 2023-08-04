import { Request, Response } from 'express';
import redis from '@/db/redisClient';
import { ANALYSIS_KEYS } from '@/utils/redisKeys';

interface QueryString {
  fingerprint: string;
}

const { COUNT_BY_ID } = ANALYSIS_KEYS;
const INIT_COUNT = 12;
const EXP_PERIOD = 24 * 60 * 60;

export const getRemainingCount = async (
  req: Request<unknown, unknown, unknown, QueryString>,
  res: Response,
) => {
  const fingerprint = req.query.fingerprint;

  if (!fingerprint) {
    const totalCount = await redis.get(ANALYSIS_KEYS.TOTAL_COUNT);
    return res.json({ count: totalCount });
  }

  try {
    const remainingCount = await redis.get(COUNT_BY_ID(fingerprint));
    if (remainingCount) return res.json({ count: remainingCount });

    await redis.set(COUNT_BY_ID(fingerprint), INIT_COUNT, 'EX', EXP_PERIOD);

    res.json({ count: INIT_COUNT });
  } catch (error) {
    console.error(error);
    let errorMessage = 'Error in getting remaining count';
    if (error instanceof Error) errorMessage += ': ' + error.message;

    res.status(500).json({ error: errorMessage });
  }
};

import { Request, Response } from 'express';

import { ANALYSIS_REDIS_KEYS, redis } from '@/services';
import { asyncHandler, throwCustomError } from '@/utils';
import { ERROR_MESSAGES } from '@/constants';

interface QueryString {
  fingerprint?: string;
}

const { COUNT_BY_ID, TOTAL_COUNT } = ANALYSIS_REDIS_KEYS;
const { REDIS_ANALYSIS_REMAINING } = ERROR_MESSAGES;
const INIT_COUNT = 12;
const EXP_PERIOD = 24 * 60 * 60;

export const getRemainingCount = asyncHandler(
  async (
    req: Request<unknown, unknown, unknown, QueryString>,
    res: Response,
  ) => {
    const fingerprint = req.query.fingerprint;

    const total = Number((await redis.get(TOTAL_COUNT)) ?? 0);
    if (total === 0) throwCustomError(REDIS_ANALYSIS_REMAINING);

    if (!fingerprint) return res.json({ count: total });

    const key = COUNT_BY_ID(fingerprint);
    const remaining = Number(await redis.get(key));
    if (remaining) return res.json({ count: Math.min(remaining, total) });

    const count = Math.min(INIT_COUNT, total);
    await redis.set(key, count, 'EX', EXP_PERIOD);

    res.json({ count });
  },
);
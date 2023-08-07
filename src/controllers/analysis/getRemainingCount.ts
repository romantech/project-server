import { Response } from 'express';

import {
  ANALYSIS_INIT_COUNT,
  ANALYSIS_KEY_EXP,
  ANALYSIS_REDIS_KEYS,
  redis,
} from '@/services';
import { asyncHandler } from '@/utils';
import { RequestWithClientIP } from '@/types';
import { validateClientIP } from '@/middlewares/validateClientIP';

const { COUNT_BY_IP, TOTAL_COUNT } = ANALYSIS_REDIS_KEYS;

export const getRemainingCount = [
  validateClientIP,
  asyncHandler(async (req: RequestWithClientIP, res: Response) => {
    const { clientIP } = req; // validateClientIP 미들웨어에서 검증하므로 항상 존재

    const total = Number(await redis.get(TOTAL_COUNT));

    const key = COUNT_BY_IP(clientIP);
    const remaining = await redis.get(key);
    const isNewClient = remaining === null;
    const count = isNewClient
      ? Math.min(ANALYSIS_INIT_COUNT, total)
      : Math.min(Number(remaining), total);

    if (isNewClient) {
      await redis.set(key, count, 'EX', ANALYSIS_KEY_EXP);
    }

    res.status(200).json({ count });
  }),
];

import { NextFunction, Response } from 'express';
import { ANALYSIS_REDIS_KEYS, redis } from '@/services';
import { throwCustomError } from '@/utils';
import { RequestWithClientIP } from '@/types';
import { ERROR_MESSAGES } from '@/constants';

const { TOTAL_COUNT, COUNT_BY_IP } = ANALYSIS_REDIS_KEYS;

export async function validateAnalysisCount(
  req: RequestWithClientIP,
  res: Response,
  next: NextFunction,
) {
  const { clientIP } = req; // 이전 미들웨어에서 설정된 값 사용.

  const [rawTotal, rawCountByIP] = await redis.mget(
    TOTAL_COUNT,
    COUNT_BY_IP(clientIP),
  );

  const total = Number(rawTotal);
  const countByIP = Number(rawCountByIP);

  if (total <= 0 || countByIP <= 0) {
    throwCustomError(ERROR_MESSAGES.ANALYSIS_NO_REMAINING, 400);
  }

  next();
}

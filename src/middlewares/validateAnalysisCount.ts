import { NextFunction, Request, Response } from 'express';
import { ANALYSIS_REDIS_KEYS, redis } from '@/services';
import { throwCustomError } from '@/utils';
import { ERROR_MESSAGES } from '@/constants';

const { TOTAL_COUNT, COUNT_BY_IP } = ANALYSIS_REDIS_KEYS;
const { IP_UNIDENTIFIABLE, ANALYSIS_NO_REMAINING } = ERROR_MESSAGES;

export async function validateAnalysisCount(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const { clientIP } = req; // 이전 미들웨어에서 설정된 값 사용.
  if (!clientIP) return throwCustomError(IP_UNIDENTIFIABLE, 400);

  const [rawTotal, rawCountByIP] = await redis.mget(
    TOTAL_COUNT,
    COUNT_BY_IP(clientIP),
  );

  const total = Number(rawTotal);
  const countByIP = Number(rawCountByIP);

  if (total <= 0 || countByIP <= 0) {
    throwCustomError(ANALYSIS_NO_REMAINING, 400);
  }

  next(); // 모든 체크 성공
}

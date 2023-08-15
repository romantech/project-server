import { NextFunction, Request, Response } from 'express';
import { ANALYSIS_KEYS, redis } from '@/services';
import { asyncHandler, throwCustomError } from '@/utils';
import { ERROR_MESSAGES } from '@/constants';
import { validateClientIP } from '@/middlewares/validateClientIP';

const { IP_UNIDENTIFIABLE } = ERROR_MESSAGES;
const {
  KEYS: { REMAINING },
  FIELDS: { ANALYSIS, RANDOM_SENTENCE },
} = ANALYSIS_KEYS;

/* 미들웨어에서 발생한 비동기 에러는 Express 에러 핸들러로 전달 안돼서 asyncHandler 함수로 랩핑 */
export const validateIPAndCount = [
  validateClientIP,
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { clientIP } = req; // 이전 미들웨어에서 설정된 값 사용.
    if (!clientIP) return throwCustomError(IP_UNIDENTIFIABLE, 400);

    const fieldName = getFieldName(req.path);

    const rawTotal = await redis.hget(REMAINING.TOTAL, fieldName);
    const rawUserTotal = await redis.hget(REMAINING.USER(clientIP), fieldName);

    const total = Number(rawTotal);
    const userTotal = Number(rawUserTotal);

    if (total <= 0 || userTotal <= 0) {
      throwCustomError('No remaining analysis count available.', 400);
    }

    next(); // 모든 체크 성공
  }),
];

const getFieldName = (pathname: string) => {
  switch (pathname) {
    case '/random-sentences':
      return RANDOM_SENTENCE;
    default:
      return ANALYSIS;
  }
};

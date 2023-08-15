import { NextFunction, Request, Response } from 'express';
import { ANALYZER_REDIS_SCHEMA, redis } from '@/services';
import { asyncHandler, throwCustomError } from '@/utils';
import { validateClientIP } from '@/middlewares/validateClientIP';
import { AnalyzerRoute } from '@/routes/analyzer';

const {
  KEYS: { REMAINING },
  FIELDS: { ANALYSIS, RANDOM_SENTENCE },
} = ANALYZER_REDIS_SCHEMA;

/* 미들웨어에서 발생한 비동기 에러는 Express 에러 핸들러로 전달 안돼서 asyncHandler 함수로 랩핑 */
export const validateAnalysisCount = [
  validateClientIP,
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    // validateClientIP 미들웨어에서 검증하므로 clientIP 항상 존재
    const clientIP = req.clientIP as string;
    const fieldName = getFieldName(req.path);

    const rawTotal = await redis.hget(REMAINING.TOTAL, fieldName);
    const rawUserTotal = await redis.hget(REMAINING.USER(clientIP), fieldName);

    const total = Number(rawTotal);
    const userTotal = Number(rawUserTotal);

    if (total <= 0 || userTotal <= 0) {
      throwCustomError('No remaining request count available.', 400);
    }

    next(); // 모든 체크 성공
  }),
];

const getFieldName = (pathname: string) => {
  switch (pathname) {
    case AnalyzerRoute.RANDOM_SENTENCES:
      return RANDOM_SENTENCE;
    default:
      return ANALYSIS;
  }
};

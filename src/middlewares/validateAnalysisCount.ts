import { NextFunction, Request, Response } from 'express';
import { ANALYSIS_REDIS_KEYS, redis } from '@/services';
import { asyncHandler, throwCustomError } from '@/utils';
import { ERROR_MESSAGES } from '@/constants';

const { TOTAL_COUNT, COUNT_BY_IP } = ANALYSIS_REDIS_KEYS;
const { IP_UNIDENTIFIABLE } = ERROR_MESSAGES;

/* 미들웨어에서 발생한 비동기 에러는 Express 에러 핸들러로 전달 안돼서 asyncHandler 함수로 랩핑 */
export const validateAnalysisCount = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { clientIP } = req; // 이전 미들웨어에서 설정된 값 사용.
    if (!clientIP) return throwCustomError(IP_UNIDENTIFIABLE, 400);

    const [rawTotal, rawCountByIP] = await redis.mget(
      TOTAL_COUNT,
      COUNT_BY_IP(clientIP),
    );

    const total = Number(rawTotal);
    const countByIP = Number(rawCountByIP);

    if (total <= 0 || countByIP <= 0) {
      throwCustomError('No remaining analysis count available.', 400);
    }

    next(); // 모든 체크 성공
  },
);

import { NextFunction, Request, Response } from 'express';
import { CustomError } from '@/utils';
import { COLORS, ERROR_MESSAGES } from '@/constants';

const { SERVER_ERROR } = ERROR_MESSAGES;
/* next 파라미터(4번째)가 없으면 에러처리 미들웨어 인식하지 않으므로 주의 */
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction,
) => {
  const isCustomError = err instanceof CustomError;
  const status = isCustomError ? err.status : 500;
  const message = isCustomError ? err.message : SERVER_ERROR;

  console.error(COLORS.failed, 'Error Caught in Request Handler: ', {
    message: err.message,
    stack: err.stack,
    timestamp: new Date(),
    path: req.path,
    method: req.method,
    headers: req.headers,
    body: req.body,
  });

  res.status(status).json({ status: 'error', message });
};
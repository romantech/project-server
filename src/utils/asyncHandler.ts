import { NextFunction, Response } from 'express';
import { RequestWithClientIP } from '@/types';

type AsyncRequestHandler = (
  req: RequestWithClientIP,
  res: Response,
  next: NextFunction,
) => Promise<Response | void>;

export const asyncHandler = (requestHandler: AsyncRequestHandler) => {
  return async (
    req: RequestWithClientIP,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      await requestHandler(req, res, next);
    } catch (err) {
      next(err);
    }
  };
};

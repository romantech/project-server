import { throwCustomError } from '@/utils';
import { ERROR_MESSAGES } from '@/constants';
import { RequestHandler } from 'express';

export const notFoundHandler: RequestHandler = (
  { originalUrl },
  _res,
  _next,
) => {
  throwCustomError(ERROR_MESSAGES.NOT_FOUND(originalUrl), 404);
};

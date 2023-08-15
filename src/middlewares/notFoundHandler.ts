import { throwCustomError } from '@/utils';
import { ERROR_MESSAGES } from '@/constants';
import { RequestHandler } from 'express';

export const notFoundHandler: RequestHandler = (req, _res, _next) => {
  const { originalUrl } = req;
  throwCustomError(ERROR_MESSAGES.NOT_FOUND(originalUrl), 404);
};

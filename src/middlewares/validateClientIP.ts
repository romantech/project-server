import { RequestHandler } from 'express';
import requestIP from 'request-ip';
import { throwCustomError } from '@/utils';
import { ERROR_MESSAGES } from '@/constants';

export const validateClientIP: RequestHandler = (req, _res, next) => {
  const IP = requestIP.getClientIp(req);
  if (!IP) return throwCustomError(ERROR_MESSAGES.IP_UNIDENTIFIABLE, 400);

  req.clientIP = IP;
  next();
};

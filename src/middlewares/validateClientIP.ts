import { NextFunction, Request, Response } from 'express';
import requestIP from 'request-ip';
import { throwCustomError } from '@/utils';
import { ERROR_MESSAGES } from '@/constants';

export function validateClientIP(
  req: Request,
  _res: Response,
  next: NextFunction,
) {
  const IP = requestIP.getClientIp(req);
  if (!IP) return throwCustomError(ERROR_MESSAGES.IP_UNIDENTIFIABLE, 400);

  req.clientIP = IP;
  next();
}

import { NextFunction } from 'express';
import requestIP from 'request-ip';
import { throwCustomError } from '@/utils';
import { ERROR_MESSAGES } from '@/constants';
import { BaseRequestWithClientIP } from '@/types';

export function validateClientIP(
  req: BaseRequestWithClientIP,
  res: Response,
  next: NextFunction,
): void {
  const IP = requestIP.getClientIp(req);

  if (!IP) {
    throwCustomError(ERROR_MESSAGES.IP_UNIDENTIFIABLE, 400);
  } else {
    req.clientIP = IP;
    next();
  }
}

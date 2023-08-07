import { Request } from 'express';

export interface BaseRequestWithClientIP extends Request {
  clientIP?: string; // 옵셔널 버전
}

export interface RequestWithClientIP extends BaseRequestWithClientIP {
  clientIP: string; // 필수 버전
}

import { RequestHandler } from 'express';

export const ignoreFavicon: RequestHandler = (req, res, next) => {
  if (req.originalUrl === '/favicon.ico') return res.status(204).end();
  next();
};

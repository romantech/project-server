import { Application } from 'express';
import { healthRouter } from './health';
import { analyzerRouter } from './analyzer';
import { ignoreFavicon } from '@/middlewares';

export const setupRoutes = (app: Application) => {
  app.use(ignoreFavicon);
  app.use('/', healthRouter);
  app.use('/analyzer', analyzerRouter);
};

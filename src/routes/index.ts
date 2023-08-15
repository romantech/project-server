import { Application } from 'express';
import { healthRouter } from './health';
import { analyzerRouter } from './analyzer';

export const setupRoutes = (app: Application) => {
  app.use('/', healthRouter);
  app.use('/analyzer', analyzerRouter);
};

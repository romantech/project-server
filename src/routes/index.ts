import { Application } from 'express';
import { healthRouter } from './health';
import { analysisRouter } from './analysis';

export const setupRoutes = (app: Application) => {
  app.use('/', healthRouter);
  app.use('/analysis', analysisRouter);
};

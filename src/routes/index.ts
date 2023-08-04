import { Application } from 'express';
import healthRouter from './health';
import analysisRouter from './analysis';

const setupRoutes = (app: Application) => {
  app.use('/', healthRouter);
  app.use('/analysis', analysisRouter);
};

export default setupRoutes;

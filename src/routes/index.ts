import { Application } from 'express';
import healthRouter from './health';
import syntaxAnalyzerRouter from './syntax-analyzer';

const setupRoutes = (app: Application) => {
  app.use('/', healthRouter);
  app.use('/syntax-analyzer', syntaxAnalyzerRouter);
};

export default setupRoutes;

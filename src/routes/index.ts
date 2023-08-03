import { Application } from 'express';
import health from './health';

const setupRoutes = (app: Application) => {
  app.use('/', health);
};

export default setupRoutes;

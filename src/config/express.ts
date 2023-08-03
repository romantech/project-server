import express, { type Application } from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import cookieParser from 'cookie-parser';

export const createServer = (): Application => {
  const app = express();

  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  app.use(compression());
  app.use(helmet());
  app.use(morgan('dev'));
  app.use(cookieParser());

  app.disable('x-powered-by');

  app.get('/health', (_req, res) => {
    res.send('UP');
  });

  return app;
};

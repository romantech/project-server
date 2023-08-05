import express, { type Application } from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { isProd } from '@/config/environment';

const morganFormat = isProd() ? 'combined' : 'dev';

export const createServer = (): Application => {
  const app = express();

  app.use(cors());
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  app.use(compression());
  app.use(helmet());
  app.use(morgan(morganFormat));
  app.use(cookieParser());

  app.disable('x-powered-by');

  return app;
};

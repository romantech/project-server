import express, { type Application } from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors, { CorsOptions } from 'cors';
import { isProd } from '@/config/environment';

const morganFormat = isProd() ? 'combined' : 'dev';
const corsOptions: CorsOptions = {
  /** Access-Control-Allow-Origin 응답 헤더 설정 (허용할 오리진 목록) */
  origin: 'http://localhost:5173', // TODO 배포후 변경
  /** Access-Control-Allow-Methods 응답 헤더 설정 (허용할 HTTP 메서드 목록) */
  methods: ['GET', 'POST'],
  /** Access-Control-Allow-Headers 응답 헤더 설정 (허용할 요청 헤더 목록) */
  allowedHeaders: ['Content-Type', 'Authorization'],
  /**
   * Access-Control-Allow-Credentials 응답 헤더 설정
   * 기본적으로 자격증명이 포함된 응답은 JS 에서 접근할 수 없음.
   * true 설정시 자격증명과 함께 요청을 수행할 때 해당 응답을 JS 에서 접근 가능
   * true 설정시 Access-Control-Allow-Origin 헤더에 와일드카드(*) 사용 불가
   * 프론트엔드에서 자격 증명을 포함하여 요청할 땐 withCredentials: true 옵션 추가 필요
   * */
  credentials: true,
  /**
   * CORS 사전 요청(Preflight Request)의 성공 상태 코드 설정
   * 기본적으로 Preflight Request 응답은 204 No Content 상태 코드를 반환하지만,
   * 레거시 브라우저에선 204 No Content 상태 코드에 문제가 발생할 수 있어 200으로 설정
   * */
  optionsSuccessStatus: 200,
};

export const createServer = (): Application => {
  const app = express();

  app.use(cors(corsOptions));
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  app.use(compression());
  app.use(helmet());
  app.use(morgan(morganFormat));
  app.use(cookieParser());

  app.disable('x-powered-by');

  return app;
};

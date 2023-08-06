import { env } from 'node:process';

/**
 * 웹스톰에서 alias 설정을 위해 tsconfig.json 파일의 baseUrl 속성을 설정하면
 * process.env 참조시 해결되지 않은 변수로 나오는 문제 있음
 * import { env } from 'node:process' 구문으로 임포트해서 사용해서 임시 해결
 * */
export const isProd = () => env.NODE_ENV === 'production';
export const PORT = isProd() ? env.PORT : 3001;
export const REDIS_HOST = env.REDIS_HOST;
export const REDIS_PORT = Number(env.REDIS_PORT);
export const REDIS_PASSWORD = env.REDIS_PASSWORD;
export const REDIS_USERNAME = env.REDIS_USERNAME;
export const OPENAI_API_KEY = env.OPENAI_API_KEY;

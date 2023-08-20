import { env } from 'node:process';

export enum EnvVars {
  PORT = 'PORT',
  NODE_ENV = 'NODE_ENV',
  OPENAI_API_KEY = 'OPENAI_API_KEY',
  REDIS_HOST = 'REDIS_HOST',
  REDIS_PORT = 'REDIS_PORT',
  REDIS_PASSWORD = 'REDIS_PASSWORD',
  REDIS_USERNAME = 'REDIS_USERNAME',
  CORS_ORIGIN = 'CORS_ORIGIN',
}

/**
 * 웹스톰에서 alias 설정을 위해 tsconfig.json 파일의 baseUrl 속성을 설정하면
 * process.env 참조시 해결되지 않은 변수로 나오는 문제 있음
 * import { env } from 'node:process' 구문으로 임포트해서 사용해서 임시 해결
 * */
export const isProd = () => env[EnvVars.NODE_ENV] === 'production';
export const PORT = isProd() ? env[EnvVars.PORT] : 3001;
export const REDIS_HOST = env[EnvVars.REDIS_HOST];
export const REDIS_PORT = Number(env[EnvVars.REDIS_PORT]);
export const REDIS_PASSWORD = env[EnvVars.REDIS_PASSWORD];
export const REDIS_USERNAME = env[EnvVars.REDIS_USERNAME];
export const OPENAI_API_KEY = env[EnvVars.OPENAI_API_KEY];
export const CORS_ORIGIN = env[EnvVars.CORS_ORIGIN]?.split(',') ?? [];

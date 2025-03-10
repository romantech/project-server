/**
 * 웹스톰에서 alias 설정을 위해 tsconfig.json 파일의 baseUrl 속성을 설정하면
 * process.env 참조시 해결되지 않은 변수로 나오는 문제 있음
 * import { env } from 'node:process' 구문으로 임포트해서 사용해서 임시 해결
 * */
import { env } from 'node:process';

export enum RequiredEnv { // Required Environment Variables
  PORT = 'PORT',
  NODE_ENV = 'NODE_ENV',
  OPENAI_API_KEY = 'OPENAI_API_KEY',
}

export enum OptionalEnv { // Optional Environment Variables
  CORS_ORIGIN = 'CORS_ORIGIN',

  REDIS_HOST = 'REDIS_HOST',
  REDIS_PORT = 'REDIS_PORT',
  REDIS_PASSWORD = 'REDIS_PASSWORD',
  REDIS_USERNAME = 'REDIS_USERNAME',

  MODEL_GPT_4O = 'MODEL_GPT_4O',
  MODEL_GPT_4O_MINI = 'MODEL_GPT_4O_MINI',
  MODEL_GPT_4O_FT = 'MODEL_GPT_4O_FT',
  MODEL_GPT_4O_MINI_FT = 'MODEL_GPT_4O_MINI_FT',
}

const loadEnvironment = () => {
  const isProd = env[RequiredEnv.NODE_ENV] === 'production';
  const DEFAULT_SERVER_PORT = 3001;

  return {
    isProd,
    port: isProd ? Number(env[RequiredEnv.PORT]) : DEFAULT_SERVER_PORT,
    corsOrigins: env[OptionalEnv.CORS_ORIGIN]?.split(',') ?? [],
    openAIKey: env[RequiredEnv.OPENAI_API_KEY],
    redis: {
      host: env[OptionalEnv.REDIS_HOST],
      port: Number(env[OptionalEnv.REDIS_PORT]),
      password: env[OptionalEnv.REDIS_PASSWORD],
      username: env[OptionalEnv.REDIS_USERNAME],
    },
    models: {
      GPT_4O: env[OptionalEnv.MODEL_GPT_4O] ?? 'gpt-4o',
      GPT_4O_MINI: env[OptionalEnv.MODEL_GPT_4O_MINI] ?? 'gpt-4o-mini',
      GPT_4O_FT: env[OptionalEnv.MODEL_GPT_4O_FT] ?? 'gpt-4o',
      GPT_4O_MINI_FT: env[OptionalEnv.MODEL_GPT_4O_MINI_FT] ?? 'gpt-4o-mini',
    },
  } as const;
};

export const envConfig = loadEnvironment();

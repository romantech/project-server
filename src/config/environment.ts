/**
 * 웹스톰에서 alias 설정을 위해 tsconfig.json 파일의 baseUrl 속성을 설정하면
 * process.env 참조시 해결되지 않은 변수로 나오는 문제 있음
 * import { env } from 'node:process' 구문으로 임포트해서 사용해서 임시 해결
 * */
import { env } from 'node:process';

export enum EnvVars {
  PORT = 'PORT',
  NODE_ENV = 'NODE_ENV',
  CORS_ORIGIN = 'CORS_ORIGIN',

  OPENAI_API_KEY = 'OPENAI_API_KEY',

  REDIS_HOST = 'REDIS_HOST',
  REDIS_PORT = 'REDIS_PORT',
  REDIS_PASSWORD = 'REDIS_PASSWORD',
  REDIS_USERNAME = 'REDIS_USERNAME',

  MODEL_GPT_3_5_FT = 'MODEL_GPT_3_5_FT',
  MODEL_GPT_3_5 = 'MODEL_GPT_3_5',
  MODEL_GPT_4 = 'MODEL_GPT_4',
}

const loadEnvironment = () => {
  const isProd = env[EnvVars.NODE_ENV] === 'production';
  const DEFAULT_SERVER_PORT = 3001;

  return {
    isProd,
    port: isProd ? env[EnvVars.PORT] : DEFAULT_SERVER_PORT,
    corsOrigins: env[EnvVars.CORS_ORIGIN]?.split(','),
    openAIKey: env[EnvVars.OPENAI_API_KEY],
    redis: {
      host: env[EnvVars.REDIS_HOST],
      port: Number(env[EnvVars.REDIS_PORT]),
      password: env[EnvVars.REDIS_PASSWORD],
      username: env[EnvVars.REDIS_USERNAME],
    },
    modelNames: {
      gpt_3_5_FT: env[EnvVars.MODEL_GPT_3_5_FT],
      gpt_3_5: env[EnvVars.MODEL_GPT_3_5],
      gpt_4: env[EnvVars.MODEL_GPT_4],
    },
  } as const;
};

export const envConfig = loadEnvironment();

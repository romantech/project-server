import { env, exit } from 'node:process';
import { logger } from '@/config';

const requiredVariables = [
  'PORT',
  'NODE_ENV',
  'OPENAI_API_KEY',
  'REDIS_HOST',
  'REDIS_PORT',
  'REDIS_PASSWORD',
  'REDIS_USERNAME',
] as const;

export const checkEnvVariables = () => {
  requiredVariables.forEach((variable) => {
    if (!env[variable]) {
      logger.error(`Environment variable ${variable} is missing!`);
      exit(1); // 프로세스 종료
    }
  });
};

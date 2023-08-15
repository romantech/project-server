import { env, exit } from 'node:process';
import { EnvVars, logger } from '@/config';

export const checkEnvVariables = () => {
  Object.values(EnvVars).forEach((variable) => {
    if (!env[variable]) {
      logger.error(`Environment variable ${variable} is missing!`);
      exit(1); // 프로세스 종료
    }
  });
};

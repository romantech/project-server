import {
  ANALYSIS_REDIS_KEYS,
  ANALYSIS_TOTAL_INIT_COUNT,
  redis,
} from '@/services';
import schedule from 'node-schedule';
import { logger } from '@/config';

const resetAnalysisTotalCountKey = () => {
  redis.set(ANALYSIS_REDIS_KEYS.TOTAL_COUNT, ANALYSIS_TOTAL_INIT_COUNT);
};

export const scheduleRedisReset = () => {
  // Koyeb 서버는 UTC 기준이므로 한국 시간(UTC+9) 00시는 '0 15 * * *'로 설정
  schedule.scheduleJob('0 15 * * *', resetAnalysisTotalCountKey);
  logger.info(
    'Scheduled Redis total count reset at UTC 15:00 (KST 00:00) daily.',
  );
};

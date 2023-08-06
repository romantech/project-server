import {
  ANALYSIS_REDIS_KEYS,
  ANALYSIS_TOTAL_INIT_COUNT,
  redis,
} from '@/services';
import schedule from 'node-schedule';

const resetTotalCountKey = () => {
  redis.set(ANALYSIS_REDIS_KEYS.TOTAL_COUNT, ANALYSIS_TOTAL_INIT_COUNT);
};

export const scheduleRedisReset = () => {
  // Koyeb 시간은 UTC 기준이므로 한국 시간(UTC+9) 24시는 '0 15 * * *'로 설정
  schedule.scheduleJob('50 9 * * *', resetTotalCountKey);
};

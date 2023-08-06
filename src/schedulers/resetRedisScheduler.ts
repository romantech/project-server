import {
  ANALYSIS_REDIS_KEYS,
  ANALYSIS_TOTAL_INIT_COUNT,
  redis,
} from '@/services';
import schedule from 'node-schedule';
import { COLORS } from '@/constants';

const { success } = COLORS;

const resetAnalysisTotalCountKey = () => {
  redis.set(ANALYSIS_REDIS_KEYS.TOTAL_COUNT, ANALYSIS_TOTAL_INIT_COUNT);
};

export const scheduleRedisReset = () => {
  // Koyeb 시간은 UTC 기준이므로 한국 시간(UTC+9) 24시는 '0 15 * * *'로 설정
  schedule.scheduleJob('0 15 * * *', resetAnalysisTotalCountKey);
  console.log(success, 'Scheduled Redis total count reset at UTC 00:00 daily.');
};

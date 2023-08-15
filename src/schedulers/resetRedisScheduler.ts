import { ANALYSIS_INIT_COUNTS, ANALYSIS_KEYS, redis } from '@/services';
import schedule from 'node-schedule';
import { logger } from '@/config';

/** Koyeb 서버는 UTC 기준이므로 한국 시간(UTC+9) 00시는 '0 15 * * *'로 설정 */
const CRON_TIME_RESET = '0 15 * * *';

const resetAnalysisCounts = async () => {
  const { ANALYSIS, RANDOM_SENTENCE } = ANALYSIS_INIT_COUNTS;
  const { KEYS, FIELDS } = ANALYSIS_KEYS;

  try {
    await redis.hmset(KEYS.REMAINING.TOTAL, {
      [FIELDS.ANALYSIS]: ANALYSIS.TOTAL,
      [FIELDS.RANDOM_SENTENCE]: RANDOM_SENTENCE.TOTAL,
    });
    logger.info('Redis total count reset successfully.');
  } catch (error) {
    logger.error('Error resetting Redis total count:', error);
  }
};

export const scheduleRedisReset = () => {
  schedule.scheduleJob(CRON_TIME_RESET, resetAnalysisCounts);
  logger.info(
    'Scheduled Redis total count reset at UTC 15:00 (KST 00:00) daily.',
  );
};

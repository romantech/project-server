const ANALYSIS_PREFIX = 'analysis';

export const ANALYSIS_REDIS_KEYS = {
  TOTAL_COUNT: `${ANALYSIS_PREFIX}:remaining:total`,
  COUNT_BY_IP: (id: string) => `${ANALYSIS_PREFIX}:remaining:${id}`,
  ANALYSIS_PROMPT: `${ANALYSIS_PREFIX}:prompt`,
};

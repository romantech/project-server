const ANALYSIS_PREFIX = 'analysis';

export const ANALYSIS_REDIS_KEYS = {
  TOTAL_COUNT: `${ANALYSIS_PREFIX}:remaining:total`,
  COUNT_BY_IP: (id: string) => `${ANALYSIS_PREFIX}:remaining:${id}`,
  PROMPT_ANALYSIS: `${ANALYSIS_PREFIX}:prompt:create-analysis`,
  PROMPT_SENTENCE: `${ANALYSIS_PREFIX}:prompt:random-sentence`,
};

const PREFIXES = { ANALYSIS: 'analysis' } as const;

const ANALYSIS_FIELDS = {
  ANALYSIS: 'analysis',
  RANDOM_SENTENCE: 'random_sentence',
} as const;

const KEYS = {
  ANALYSIS: {
    REMAINING: {
      TOTAL: `${PREFIXES.ANALYSIS}:remaining:total`,
      USER: (ip: string) => {
        return `${PREFIXES.ANALYSIS}:remaining:user:${ip}` as const;
      },
    },
    PROMPT: `${PREFIXES.ANALYSIS}:prompt`,
  },
} as const;

export const ANALYSIS_KEYS = {
  KEYS: KEYS.ANALYSIS,
  FIELDS: ANALYSIS_FIELDS,
} as const;

export type AnalysisFields = Record<
  (typeof ANALYSIS_FIELDS)[keyof typeof ANALYSIS_FIELDS],
  string
>;

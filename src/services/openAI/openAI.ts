import { envConfig } from '@/config';
import { ANALYZER_REDIS_SCHEMA } from '@/services/redis';
import { ChatOpenAIFields } from '@langchain/openai';

const { FIELDS } = ANALYZER_REDIS_SCHEMA;

const FINE_TUNE_SUFFIX = '_fine_tuned';

/** 클라이언트 요청과 일치 */
export enum AIModelKey {
  PRIMARY = 'primary',
  FAST = 'fast',
  PRIMARY_FT = 'primary-ft',
  FAST_FT = 'fast-ft',
}

export const AI_MODEL = {
  [AIModelKey.PRIMARY]: envConfig.models.PRIMARY,
  [AIModelKey.FAST]: envConfig.models.FAST,
  [AIModelKey.PRIMARY_FT]: envConfig.models.PRIMARY_FT,
  [AIModelKey.FAST_FT]: envConfig.models.FAST_FT,
} as const;

export const ANALYSIS_MODEL_OPTION = {
  [AIModelKey.PRIMARY]: {
    promptField: FIELDS.ANALYSIS,
    temperature: 0.6,
    model: AI_MODEL[AIModelKey.PRIMARY],
  },
  [AIModelKey.PRIMARY_FT]: {
    promptField: FIELDS.ANALYSIS + FINE_TUNE_SUFFIX,
    temperature: 0.6,
    model: AI_MODEL[AIModelKey.PRIMARY_FT],
  },
  [AIModelKey.FAST_FT]: {
    promptField: FIELDS.ANALYSIS + FINE_TUNE_SUFFIX,
    temperature: 0.6,
    model: AI_MODEL[AIModelKey.FAST_FT],
  },
} as const;

export const RANDOM_SENTENCE_CONFIG = {
  temperature: 1,
  model: AI_MODEL[AIModelKey.FAST],
  reasoning: { effort: 'minimal' },
} satisfies ChatOpenAIFields;

export const ANALYSIS_MODEL = Object.keys(ANALYSIS_MODEL_OPTION);
export type AnalysisModel = keyof typeof ANALYSIS_MODEL_OPTION;

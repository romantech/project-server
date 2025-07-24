import { envConfig } from '@/config';
import { ANALYZER_REDIS_SCHEMA } from '@/services/redis';
import { ChatOpenAIFields } from '@langchain/openai';

const { FIELDS } = ANALYZER_REDIS_SCHEMA;

const FINE_TUNE_SUFFIX = '_fine_tuned';

/** 클라이언트 요청과 일치 */
export enum AIModelKey {
  GPT_4O = 'gpt-4o',
  GPT_4O_MINI = 'gpt-4o-mini',
  GPT_4O_FT = 'gpt-4o-ft',
  GPT_4O_MINI_FT = 'gpt-4o-mini-ft',
}

export const AI_MODEL = {
  [AIModelKey.GPT_4O]: envConfig.models.GPT_4O,
  [AIModelKey.GPT_4O_MINI]: envConfig.models.GPT_4O_MINI,
  [AIModelKey.GPT_4O_FT]: envConfig.models.GPT_4O_FT,
  [AIModelKey.GPT_4O_MINI_FT]: envConfig.models.GPT_4O_MINI_FT,
} as const;

export const ANALYSIS_MODEL_OPTION = {
  [AIModelKey.GPT_4O_FT]: {
    promptField: FIELDS.ANALYSIS + FINE_TUNE_SUFFIX,
    temperature: 0.6,
    model: AI_MODEL[AIModelKey.GPT_4O_FT],
  },
  [AIModelKey.GPT_4O_MINI_FT]: {
    promptField: FIELDS.ANALYSIS + FINE_TUNE_SUFFIX,
    temperature: 0.6,
    model: AI_MODEL[AIModelKey.GPT_4O_MINI_FT],
  },
} as const;

export const RANDOM_SENTENCE_CONFIG = {
  temperature: 1,
  model: AI_MODEL[AIModelKey.GPT_4O_MINI],
} satisfies ChatOpenAIFields;

export const ANALYSIS_MODEL = Object.keys(ANALYSIS_MODEL_OPTION);
export type AnalysisModel = keyof typeof ANALYSIS_MODEL_OPTION;

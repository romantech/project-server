import {
  MODEL_NAME_GPT_3_5,
  MODEL_NAME_GPT_3_5_FT,
  MODEL_NAME_GPT_4,
} from '@/config';
import { ANALYZER_REDIS_SCHEMA } from '@/services/redis';

const { FIELDS } = ANALYZER_REDIS_SCHEMA;

const FINE_TUNE_SUFFIX = '_fine_tuned';

export enum AIModelKey {
  GPT_3_5 = 'gpt-3.5',
  GPT_3_5_FT = 'gpt-3.5-ft',
  GPT_4 = 'gpt-4',
}

export const AI_MODEL = {
  [AIModelKey.GPT_3_5]: MODEL_NAME_GPT_3_5,
  [AIModelKey.GPT_3_5_FT]: MODEL_NAME_GPT_3_5_FT,
  [AIModelKey.GPT_4]: MODEL_NAME_GPT_4,
};

export const ANALYSIS_MODEL_OPTION = {
  [AIModelKey.GPT_3_5_FT]: {
    promptField: FIELDS.ANALYSIS + FINE_TUNE_SUFFIX,
    temperature: 0.6,
    modelName: AI_MODEL[AIModelKey.GPT_3_5_FT],
  },
  [AIModelKey.GPT_4]: {
    promptField: FIELDS.ANALYSIS,
    temperature: 0.4,
    modelName: AI_MODEL[AIModelKey.GPT_4],
  },
};

export const ANALYSIS_MODEL = Object.keys(ANALYSIS_MODEL_OPTION);
export type AnalysisModel = keyof typeof ANALYSIS_MODEL_OPTION;

import { FINE_TUNED_ID } from '@/config';
import { ANALYZER_REDIS_SCHEMA } from '@/services/redis';

const { FIELDS } = ANALYZER_REDIS_SCHEMA;

const FINE_TUNE_SUFFIX = '_fine_tuned';

export enum GPTModel {
  GPT_3 = 'gpt-3.5-turbo',
  GPT_4 = 'gpt-4',
}

export const GPT_MODEL_LIST = Object.values(GPTModel);

export const ANALYSIS_MODEL_OPTIONS = {
  [GPTModel.GPT_3]: {
    promptField: FIELDS.ANALYSIS + FINE_TUNE_SUFFIX,
    temperature: 0.6,
    modelName: FINE_TUNED_ID ?? GPTModel.GPT_3,
  },
  [GPTModel.GPT_4]: {
    promptField: FIELDS.ANALYSIS,
    temperature: 0.4,
    modelName: GPTModel.GPT_4,
  },
} as const;

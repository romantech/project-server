import { FINE_TUNED_ID } from '@/config';

export enum GPTModels {
  GPT_3 = 'gpt-3.5-turbo',
  GPT_4 = 'gpt-4',
}

export const GPT_MODEL_LIST = Object.values(GPTModels);

export type GPTModel = (typeof GPT_MODEL_LIST)[number];

export const getAnalysisModel = (model: GPTModels) => {
  switch (model) {
    case GPTModels.GPT_3:
      return FINE_TUNED_ID ?? model;
    default:
      return model;
  }
};

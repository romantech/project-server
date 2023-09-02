import { FINE_TUNED_ID, logger } from '@/config';
import { OpenAI } from 'langchain/llms/openai';

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

export const validateAndFixJSON = async (jsonString: string) => {
  try {
    return JSON.parse(jsonString);
  } catch (e) {
    logger.warn(`Failed to parse JSON ${e}`);
    logger.info('Trying to fix JSON');

    const llm = new OpenAI({ temperature: 0, modelName: GPTModels.GPT_3 });
    const prompt = `Fix JSON format and the results should be returned in JSON: ${jsonString}`;

    const analysis = await llm.predict(prompt);
    return JSON.parse(analysis);
  }
};

import OpenAI from 'openai';
import { FINE_TUNED_ID, OPENAI_API_KEY } from '@/config';
import { throwCustomError } from '@/utils';
import { ERROR_MESSAGES, GPTModels } from '@/constants';
import { CompletionCreateParamsNonStreaming } from 'openai/src/resources/chat/completions';

export const openai = new OpenAI({ apiKey: OPENAI_API_KEY });

export const getFineTunedModel = (model: GPTModels) => {
  switch (model) {
    case GPTModels.GPT_3:
      return FINE_TUNED_ID ?? model;
    default:
      return model;
  }
};

export const fetchFromOpenAI = async (
  request: CompletionCreateParamsNonStreaming,
) => {
  const { SERVICE_ERROR } = ERROR_MESSAGES;

  try {
    const { choices } = await openai.chat.completions.create(request);
    return choices[0].message.content ?? null;
  } catch (error) {
    throwCustomError(SERVICE_ERROR('OpenAI'), 500);
  }
};

import { Configuration, CreateChatCompletionRequest, OpenAIApi } from 'openai';
import { FINE_TUNED_ID, OPENAI_API_KEY } from '@/config';
import { throwCustomError } from '@/utils';
import { ERROR_MESSAGES, GPTModels } from '@/constants';

const configuration = new Configuration({ apiKey: OPENAI_API_KEY });
export const openai = new OpenAIApi(configuration);

export const getFineTunedModel = (model: GPTModels) => {
  switch (model) {
    case GPTModels.GPT_3:
      return FINE_TUNED_ID ?? model;
    default:
      return model;
  }
};

export const fetchFromOpenAI = async (request: CreateChatCompletionRequest) => {
  const { SERVICE_ERROR } = ERROR_MESSAGES;

  try {
    const completion = await openai.createChatCompletion(request);

    return completion.data.choices[0]?.message?.content || null;
  } catch (error) {
    throwCustomError(SERVICE_ERROR('OpenAI'), 500);
  }
};

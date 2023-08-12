import { Configuration, CreateChatCompletionRequest, OpenAIApi } from 'openai';
import { OPENAI_API_KEY } from '@/config';
import { throwCustomError } from '@/utils';
import { ERROR_MESSAGES } from '@/constants';

const configuration = new Configuration({ apiKey: OPENAI_API_KEY });
export const openai = new OpenAIApi(configuration);

export const fetchFromOpenAI = async (request: CreateChatCompletionRequest) => {
  const { SERVICE_ERROR } = ERROR_MESSAGES;

  try {
    const completion = await openai.createChatCompletion(request);

    return completion.data.choices[0]?.message?.content || null;
  } catch (error) {
    throwCustomError(SERVICE_ERROR('OpenAI'), 500);
  }
};

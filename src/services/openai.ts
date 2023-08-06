import { Configuration, OpenAIApi } from 'openai';
import { OPENAI_API_KEY } from '@/config';

const configuration = new Configuration({ apiKey: OPENAI_API_KEY });
export const openai = new OpenAIApi(configuration);
export const OPENAI_SETTINGS = { temperature: 0.4 } as const;
export const GPT_MODELS = ['gpt-3.5-turbo', 'gpt-4'];
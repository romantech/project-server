import { Configuration, OpenAIApi } from 'openai';
import { OPENAI_API_KEY } from '@/config/environment';

const configuration = new Configuration({ apiKey: OPENAI_API_KEY });

export const openai = new OpenAIApi(configuration);

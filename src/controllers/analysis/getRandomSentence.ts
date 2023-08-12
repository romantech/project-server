import { asyncHandler, throwCustomError } from '@/utils';
import { ParamsDictionary } from 'express-serve-static-core';
import { ANALYSIS_REDIS_KEYS, openai, redis } from '@/services';
import {
  ERROR_MESSAGES,
  MODEL_GPT_3_5,
  SENTENCE_QUERY_KEYS,
  SentenceQuery,
} from '@/constants';
import {
  checkMaxCharField,
  checkSentenceCountField,
  checkTopicsField,
} from '@/validators';
import { handleValidationErrors } from '@/middlewares';

const { SENT_COUNT, TOPICS, MAX_CHARS } = SENTENCE_QUERY_KEYS;
const { PROMPT_SENTENCE } = ANALYSIS_REDIS_KEYS;
const { RETRIEVE_FAILED, GENERATE_FAILED, SERVICE_ERROR } = ERROR_MESSAGES;

export const getRandomSentence = [
  checkMaxCharField,
  checkTopicsField,
  checkSentenceCountField,
  handleValidationErrors,
  asyncHandler<ParamsDictionary, unknown, unknown, SentenceQuery>(
    async (req, res) => {
      const { sent_count, topics, max_chars } = req.query;

      const template = await redis.get(PROMPT_SENTENCE);
      if (!template) return throwCustomError(RETRIEVE_FAILED('template'), 500);

      const prompt = replaceTemplateValues(
        template,
        sent_count,
        topics.join(', '),
        max_chars,
      );

      const sentence = await fetchSentenceFromOpenAI(prompt);
      if (!sentence) return throwCustomError(GENERATE_FAILED('sentence'), 500);

      res.status(200).json(JSON.parse(sentence));
    },
  ),
];

const replaceTemplateValues = (
  template: string,
  count: string,
  topics: string,
  chars: string,
) => {
  return template
    .replace(`{${SENT_COUNT}}`, count)
    .replace(`{${TOPICS}}`, topics)
    .replace(`{${MAX_CHARS}}`, chars);
};

const fetchSentenceFromOpenAI = async (prompt: string) => {
  try {
    const completion = await openai.createChatCompletion({
      model: MODEL_GPT_3_5,
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
    });

    return completion.data.choices?.[0]?.message?.content || null;
  } catch (error) {
    throwCustomError(SERVICE_ERROR('OpenAI'), 500);
  }
};

import { asyncHandler, throwCustomError } from '@/utils';
import { ParamsDictionary } from 'express-serve-static-core';
import {
  decrementRedisCounters,
  fetchFromOpenAI,
  redis,
  REDIS_ANALYZER,
} from '@/services';
import {
  ERROR_MESSAGES,
  MODEL_GPT_3_5,
  RANDOM_SENTENCE_PARAM_KEYS,
  RandomSentenceParams,
} from '@/constants';
import {
  checkMaxCharField,
  checkSentenceCountField,
  checkTopicsField,
} from '@/validators';
import { handleValidationErrors, validateAnalysisCount } from '@/middlewares';

const { SENT_COUNT, TOPICS, MAX_CHARS } = RANDOM_SENTENCE_PARAM_KEYS;
const { RETRIEVE_FAILED, GENERATE_FAILED } = ERROR_MESSAGES;
const { KEYS, FIELDS } = REDIS_ANALYZER;

export const getRandomSentences = [
  checkMaxCharField,
  checkTopicsField,
  checkSentenceCountField,
  validateAnalysisCount,
  handleValidationErrors,
  asyncHandler<ParamsDictionary, unknown, unknown, RandomSentenceParams>(
    async (req, res) => {
      // validateClientIP 미들웨어에서 검증하므로 항상 존재
      const clientIP = req.clientIP as string;
      const { sent_count, topics, max_chars } = req.query;

      const template = await redis.hget(KEYS.PROMPT, FIELDS.RANDOM_SENTENCE);
      if (!template) return throwCustomError(RETRIEVE_FAILED('template'), 500);

      const prompt = replaceTemplateValues(
        template,
        sent_count,
        topics.join(', '),
        max_chars,
      );

      const sentence = await fetchSentenceFromOpenAI(prompt);
      if (!sentence) return throwCustomError(GENERATE_FAILED('sentence'), 500);

      await decrementRedisCounters(clientIP, FIELDS.RANDOM_SENTENCE, 1);
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
  return fetchFromOpenAI({
    model: MODEL_GPT_3_5,
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.7,
  });
};

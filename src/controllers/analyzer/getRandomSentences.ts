import { asyncHandler, throwCustomError } from '@/utils';
import { ParamsDictionary } from 'express-serve-static-core';
import {
  AI_MODEL,
  AIModelKey,
  ANALYZER_REDIS_SCHEMA,
  decrementRedisCounters,
  redis,
} from '@/services';
import {
  ERROR_MESSAGES,
  RandomSentenceParams,
  sentencesSchema,
} from '@/constants';
import {
  checkMaxCharField,
  checkSentenceCountField,
  checkTopicsField,
} from '@/validators';
import { handleValidationErrors, validateAnalysisCount } from '@/middlewares';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import { ChatOpenAI } from '@langchain/openai';

const { RETRIEVE_FAILED } = ERROR_MESSAGES;
const { KEYS, FIELDS } = ANALYZER_REDIS_SCHEMA;
const DECREMENT_COUNT = 1;

export const getRandomSentences = [
  checkMaxCharField,
  checkTopicsField,
  checkSentenceCountField,
  validateAnalysisCount,
  handleValidationErrors,
  asyncHandler<ParamsDictionary, unknown, unknown, RandomSentenceParams>(
    async (req, res) => {
      const clientIP = req.clientIP as string; // validateClientIP 미들웨어에서 검증하므로 항상 존재

      const sentences = await generateRandomSentences(req.query);

      await decrementRedisCounters(
        [KEYS.REMAINING.TOTAL, KEYS.REMAINING.USER(clientIP)],
        FIELDS.RANDOM_SENTENCE,
        DECREMENT_COUNT,
      );

      res.status(200).json(sentences);
    },
  ),
];

const retrieveRandomSentencePrompt = async (query: RandomSentenceParams) => {
  const template = await redis.hget(KEYS.PROMPT, FIELDS.RANDOM_SENTENCE);
  if (!template) return throwCustomError(RETRIEVE_FAILED('template'), 500);

  const topics = query.topics.join(', ');
  const prompt = ChatPromptTemplate.fromTemplate(template);

  return await prompt.format({ ...query, topics });
};

const generateRandomSentences = async (query: RandomSentenceParams) => {
  const prompt = await retrieveRandomSentencePrompt(query);
  const model = new ChatOpenAI({
    temperature: 0.8,
    modelName: AI_MODEL[AIModelKey.GPT_4O],
  }).withStructuredOutput(sentencesSchema);

  const { sentences } = await model.invoke(prompt);
  return sentences;
};

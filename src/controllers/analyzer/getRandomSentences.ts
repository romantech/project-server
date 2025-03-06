import { asyncHandler, throwCustomError } from '@/utils';
import { ParamsDictionary } from 'express-serve-static-core';
import {
  ANALYZER_REDIS_SCHEMA,
  decrementRedisCounters,
  RANDOM_SENTENCE_CONFIG,
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
      const clientIP = req.clientIP!; // validateClientIP 미들웨어에서 검증하므로 항상 존재

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

  const prompt = ChatPromptTemplate.fromTemplate(template);
  return await prompt.invoke({ ...query, topics: query.topics });
};

const generateRandomSentences = async (query: RandomSentenceParams) => {
  const prompt = await retrieveRandomSentencePrompt(query);
  const llm = new ChatOpenAI(RANDOM_SENTENCE_CONFIG).withStructuredOutput(
    sentencesSchema,
  );

  const { sentences } = await llm.invoke(prompt);
  return sentences;
};

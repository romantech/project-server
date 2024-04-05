import { asyncHandler, throwCustomError } from '@/utils';
import { ParamsDictionary } from 'express-serve-static-core';
import {
  ANALYZER_REDIS_SCHEMA,
  decrementRedisCounters,
  GPTModel,
  redis,
} from '@/services';
import { ERROR_MESSAGES, RandomSentenceParams } from '@/constants';
import {
  checkMaxCharField,
  checkSentenceCountField,
  checkTopicsField,
} from '@/validators';
import { handleValidationErrors, validateAnalysisCount } from '@/middlewares';
import { PromptTemplate } from '@langchain/core/prompts';
import { OpenAI } from '@langchain/openai';

const { RETRIEVE_FAILED, GENERATE_FAILED } = ERROR_MESSAGES;
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

      res.status(200).json(JSON.parse(sentences));
    },
  ),
];

const retrieveRandomSentencePrompt = async (query: RandomSentenceParams) => {
  const template = await redis.hget(KEYS.PROMPT, FIELDS.RANDOM_SENTENCE);
  if (!template) return throwCustomError(RETRIEVE_FAILED('template'), 500);

  const topics = query.topics.join(', ');
  const prompt = PromptTemplate.fromTemplate(template);

  return await prompt.format({ ...query, topics });
};

const generateRandomSentences = async (query: RandomSentenceParams) => {
  const prompt = await retrieveRandomSentencePrompt(query);
  const llm = new OpenAI({ temperature: 1, modelName: GPTModel.GPT_3 });

  const sentences = await llm.invoke(prompt);
  if (!sentences) return throwCustomError(GENERATE_FAILED('sentence'), 500);

  return sentences;
};

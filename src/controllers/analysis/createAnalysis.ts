import { Request, Response } from 'express';
import { asyncHandler } from '@/utils/asyncHandler';
import redis from '@/db/redisClient';
import { analysisPrompt } from '@/utils/analysisPrompt';
import { throwCustomError } from '@/utils/customError';
import { openai } from '@/config/openai';
import { ERROR_MESSAGES } from '@/utils/errorMessages';
import { body, validationResult } from 'express-validator';
import { ANALYSIS_REDIS_KEYS } from '@/utils/redisKeys';

type GPTModel = (typeof GPT_MODELS)[number];
type RequestBody = {
  sentence: string[];
  model: GPTModel;
  fingerprint: string;
};

const GPT_MODELS = ['gpt-3.5-turbo', 'gpt-4'];
const { ANALYSIS_INVALID_REQUEST, ANALYSIS_INVALID_MODEL } = ERROR_MESSAGES;
const { TOTAL_COUNT, COUNT_BY_ID } = ANALYSIS_REDIS_KEYS;

const checkSentence = body('sentence')
  .isArray({ min: 2, max: 20 })
  .withMessage(ANALYSIS_INVALID_REQUEST(['sentence']));

const checkModel = body('model')
  .isIn(GPT_MODELS)
  .withMessage(ANALYSIS_INVALID_MODEL(GPT_MODELS));

const checkFingerprint = body('fingerprint')
  .notEmpty()
  .withMessage(ANALYSIS_INVALID_REQUEST(['fingerprint']));

export const createAnalysis = [
  checkSentence,
  checkModel,
  checkFingerprint,
  asyncHandler(async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { sentence, model, fingerprint }: RequestBody = req.body;

    const completion = await openai.createChatCompletion({
      model,
      messages: [
        { role: 'system', content: analysisPrompt },
        { role: 'user', content: JSON.stringify(sentence) },
      ],
      temperature: 0.4,
    });

    if (!completion) throwCustomError('Error with OpenAI API request');

    const decValue = model === 'gpt-4' ? 3 : 1;
    await redis.decrby(TOTAL_COUNT, decValue);
    await redis.decrby(COUNT_BY_ID(fingerprint), decValue);
    res.json({ result: completion.data.choices[0] });
  }),
];

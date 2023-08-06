import { Request, Response } from 'express';

import { analysisPrompt } from '@/constants';
import { asyncHandler, throwCustomError } from '@/utils';
import {
  ANALYSIS_REDIS_KEYS,
  GPT_MODELS,
  openai,
  OPENAI_SETTINGS,
  redis,
} from '@/services';

import { validationResult } from 'express-validator';
import { checkFingerprint, checkModel, checkSentence } from '@/validators';
import { validateAnalysisCount } from '@/middlewares';

type RequestBody = {
  sentence: string[];
  model: (typeof GPT_MODELS)[number];
  fingerprint: string;
};

const { TOTAL_COUNT, COUNT_BY_ID } = ANALYSIS_REDIS_KEYS;

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
    await validateAnalysisCount(fingerprint);

    try {
      const completion = await openai.createChatCompletion({
        model,
        messages: [
          { role: 'system', content: analysisPrompt },
          { role: 'user', content: JSON.stringify(sentence) },
        ],
        ...OPENAI_SETTINGS,
      });

      const decValue = model === 'gpt-4' ? 3 : 1;
      await redis.decrby(TOTAL_COUNT, decValue);
      await redis.decrby(COUNT_BY_ID(fingerprint), decValue);
      res.json(completion.data.choices[0].message?.content);
    } catch (err) {
      // @ts-expect-error openai error response
      const { response } = err;
      throwCustomError(response.data.error.message, response.status);
    }
  }),
];

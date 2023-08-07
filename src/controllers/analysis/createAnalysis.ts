import { Response } from 'express';

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
import { checkModelField, checkSentenceField } from '@/validators';
import { validateAnalysisCount } from '@/middlewares';
import { validateClientIP } from '@/middlewares/validateClientIP';
import { RequestWithClientIP } from '@/types';

type RequestBody = {
  sentence: string[];
  model: (typeof GPT_MODELS)[number];
};

const { TOTAL_COUNT, COUNT_BY_IP } = ANALYSIS_REDIS_KEYS;

const getDecrementValue = (model: string) => {
  switch (model) {
    case 'gpt-4':
      return 3;
    default:
      return 1;
  }
};

export const createAnalysis = [
  checkSentenceField,
  checkModelField,
  validateClientIP,
  validateAnalysisCount,
  asyncHandler(async (req: RequestWithClientIP, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { clientIP } = req; // validateClientIP 미들웨어에서 검증하므로 항상 존재
    const { sentence, model }: RequestBody = req.body;
    const decValue = getDecrementValue(model);

    try {
      const completion = await openai.createChatCompletion({
        model,
        messages: [
          { role: 'system', content: analysisPrompt },
          { role: 'user', content: JSON.stringify(sentence) },
        ],
        ...OPENAI_SETTINGS,
      });

      /**
       * Redis Multi 기능(트랜젝션과 유사)을 사용해 데이터의 일관성/무결성 보장.
       * 트랜젝션은 DB 작업 단위 중 하나로 일련의 연산을 하나로 묶는 것을 의미
       * 이를 통해 모든 연산이 성공적으로 이뤄져야만 전체 작업을 확정(커밋)할 수 있음
       * */
      const multi = redis.multi();
      multi.decrby(TOTAL_COUNT, decValue);
      multi.decrby(COUNT_BY_IP(clientIP), decValue);
      await multi.exec();

      const analysis = completion.data.choices[0].message?.content;
      if (analysis) res.status(200).json(JSON.parse(analysis));
    } catch (err) {
      // @ts-expect-error 에러 타입 정의 필요
      const { response } = err;
      throwCustomError(response.data.error.message, response.status);
    }
  }),
];

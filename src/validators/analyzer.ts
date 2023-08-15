import { body, query } from 'express-validator';
import {
  ERROR_MESSAGES,
  GPT_MODEL_LIST,
  RandomSentenceParam,
} from '@/constants';

const { MISSING_FIELD } = ERROR_MESSAGES;
const { SENT_COUNT, TOPICS, MAX_CHARS } = RandomSentenceParam;

/* POST /analysis */
export const checkSentenceField = body('sentence')
  .isArray({ min: 2, max: 20 })
  .withMessage(MISSING_FIELD('sentence'));

/** GET /analysis/random-sentence */
export const checkModelField = body('model')
  .isIn(GPT_MODEL_LIST)
  .withMessage(
    `Invalid model value. Allowed values are '${GPT_MODEL_LIST.join(', ')}'`,
  );

// 생성할 영어 문장 갯수 optional
export const checkSentenceCountField = query(SENT_COUNT)
  .default(5)
  .isInt({ min: 1, max: 5 })
  .withMessage('Sentence count must be between 1 and 5.');

// 주제 키워드 optional
export const checkTopicsField = query(TOPICS)
  .toArray()
  .isArray({ max: 3 })
  .withMessage('A maximum of 3 topics is allowed.');

// 각 문장의 최대 글자수 optional
export const checkMaxCharField = query(MAX_CHARS)
  .default(90)
  .isInt({ min: 10, max: 90 })
  .withMessage('Max characters must be between 10 and 90.');

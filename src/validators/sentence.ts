import { query } from 'express-validator';
import { SENTENCE_QUERY_KEYS } from '@/constants';

const { SENT_COUNT, TOPICS, MAX_CHARS } = SENTENCE_QUERY_KEYS;

// 생성할 영어 문장 갯수
export const checkSentenceCountField = query(SENT_COUNT)
  .default(5)
  .isInt({ min: 1, max: 10 })
  .withMessage('Sentence count must be between 1 and 10.');

// 주제 키워드
export const checkTopicsField = query(TOPICS)
  .toArray()
  .isArray({ min: 0, max: 5 })
  .withMessage('A maximum of 5 topics is allowed.');

// 각 문장의 최대 글자수
export const checkMaxCharField = query(MAX_CHARS)
  .default(90)
  .isInt({ min: 10, max: 90 })
  .withMessage('Max characters must be between 10 and 90.');

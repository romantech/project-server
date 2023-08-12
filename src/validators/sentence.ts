import { query } from 'express-validator';
import { SENTENCE_QUERY_KEYS } from '@/constants';

const { SENT_COUNT, TOPICS, MAX_CHAR } = SENTENCE_QUERY_KEYS;

// 생성할 영어 문장 갯수
export const checkSentenceCountField = query(SENT_COUNT)
  .default(5)
  .isInt({ min: 1, max: 10 })
  .withMessage('Sentence count: 1-10');

// 주제 키워드
export const checkTopicsField = query(TOPICS)
  .toArray()
  .isArray({ min: 0, max: 10 })
  .withMessage('A maximum of 10 topics is allowed');

// 최대 글자 수
export const checkMaxCharField = query(MAX_CHAR)
  .default(90)
  .isInt({ min: 5, max: 90 })
  .withMessage('Max characters: 5-90');

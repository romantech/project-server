import { AIModelKey } from '@/services';

export const ANALYSIS_DECREMENT_COUNT = {
  [AIModelKey.GPT_3_5_FT]: 1,
  [AIModelKey.GPT_4]: 5,
};

export enum RandomSentenceParam {
  SENT_COUNT = 'sent_count',
  TOPICS = 'topics',
  MAX_CHARS = 'max_chars',
}

export type RandomSentenceParams = {
  /** 생성할 영어 문장 개수 */
  [RandomSentenceParam.SENT_COUNT]: string;
  /** 주제 키워드 */
  [RandomSentenceParam.TOPICS]: string[];
  /** 각 문장의 최대 글자 수 */
  [RandomSentenceParam.MAX_CHARS]: string;
};

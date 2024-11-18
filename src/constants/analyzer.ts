import { AIModelKey } from '@/services';
import { z } from 'zod';
import { ParsedQs } from 'openai/internal/qs/types';

export const ANALYSIS_DECREMENT_COUNT = {
  [AIModelKey.GPT_4O_MINI_FT]: 1,
  [AIModelKey.GPT_4O_FT]: 2,
};

export enum RandomSentenceParam {
  SENT_COUNT = 'sent_count',
  TOPICS = 'topics',
  MAX_CHARS = 'max_chars',
}

export interface RandomSentenceParams extends ParsedQs {
  /** 생성할 영어 문장 개수 */
  [RandomSentenceParam.SENT_COUNT]: string;
  /** 주제 키워드 */
  [RandomSentenceParam.TOPICS]: string[];
  /** 각 문장의 최대 글자 수 */
  [RandomSentenceParam.MAX_CHARS]: string;
}

export const sentencesSchema = z.object({
  sentences: z.array(z.string()).describe('sentences'),
});

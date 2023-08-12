export const MODEL_GPT_4 = 'gpt-4';
export const MODEL_GPT_3_5 = 'gpt-3.5-turbo';

export type GPTModels = (typeof GPT_MODELS)[number];
export const GPT_MODELS = [MODEL_GPT_3_5, MODEL_GPT_4] as const;

export type RandomSentenceParams = {
  /** 생성할 영어 문장 개수 */
  sent_count: string;
  /** 주제 키워드 */
  topics: string[];
  /** 각 문장의 최대 글자 수 */
  max_chars: string;
};

export const RANDOM_SENTENCE_PARAM_KEYS = {
  SENT_COUNT: 'sent_count',
  TOPICS: 'topics',
  MAX_CHARS: 'max_chars',
} satisfies Record<string, keyof RandomSentenceParams>;

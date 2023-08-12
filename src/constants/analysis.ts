export const MODEL_GPT_4 = 'gpt-4';
export const MODEL_GPT_3_5 = 'gpt-3.5-turbo';
export const GPT_MODELS = [MODEL_GPT_3_5, MODEL_GPT_4];

export type SentenceQuery = {
  sent_count: string; // 생성할 영어 문장 갯수
  topics: string[]; // 주제 키워드
  max_char: string; // 최대 글자 수
};

export const SENTENCE_QUERY_KEYS: Record<string, keyof SentenceQuery> = {
  SENT_COUNT: 'sent_count',
  TOPICS: 'topics',
  MAX_CHAR: 'max_char',
};

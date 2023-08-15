export enum GPTModels {
  GPT_3 = 'gpt-3.5-turbo',
  GPT_4 = 'gpt-4',
}

export const GPT_MODEL_LIST = Object.values(GPTModels);
export type GPTModel = (typeof GPT_MODEL_LIST)[number];

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

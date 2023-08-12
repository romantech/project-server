import { asyncHandler } from '@/utils';
import { ParamsDictionary } from 'express-serve-static-core';
import { ANALYSIS_REDIS_KEYS, openai, redis } from '@/services';
import { MODEL_GPT_3_5, SENTENCE_QUERY_KEYS, SentenceQuery } from '@/constants';
import {
  checkMaxCharField,
  checkSentenceCountField,
  checkTopicsField,
} from '@/validators';
import { handleValidationErrors } from '@/middlewares';

const { SENT_COUNT, TOPICS, MAX_CHAR } = SENTENCE_QUERY_KEYS;

export const getRandomSentence = [
  checkMaxCharField,
  checkTopicsField,
  checkSentenceCountField,
  handleValidationErrors,
  asyncHandler<ParamsDictionary, unknown, unknown, SentenceQuery>(
    async (req, res) => {
      const { sent_count, topics, max_char } = req.query;

      const template = await getPromptTemplate();

      const prompt = replaceTemplateValues(
        template,
        sent_count,
        topics.join(', '),
        max_char,
      );

      const completion = await getSentenceFromOpenAI(prompt);
      const sentence = completion.data.choices?.[0]?.message?.content;

      res.status(200).json({ sentence });
    },
  ),
];

const getPromptTemplate = async (): Promise<string> => {
  return (await redis.get(ANALYSIS_REDIS_KEYS.PROMPT_SENTENCE)) as string;
};

const replaceTemplateValues = (
  template: string,
  count: string,
  topic: string,
  max: string,
) => {
  return template
    .replace(`{${SENT_COUNT}}`, count)
    .replace(`{${TOPICS}}`, topic)
    .replace(`{${MAX_CHAR}}`, max);
};

const getSentenceFromOpenAI = async (prompt: string) => {
  return await openai.createChatCompletion({
    model: MODEL_GPT_3_5,
    messages: [{ role: 'user', content: prompt }],
  });
};

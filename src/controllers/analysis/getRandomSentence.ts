import { asyncHandler, throwCustomError } from '@/utils';
import { ParamsDictionary } from 'express-serve-static-core';
import { ANALYSIS_REDIS_KEYS, openai, redis } from '@/services';
import { MODEL_GPT_3_5, SENTENCE_QUERY_KEYS, SentenceQuery } from '@/constants';
import {
  checkMaxCharField,
  checkSentenceCountField,
  checkTopicsField,
} from '@/validators';
import { handleValidationErrors } from '@/middlewares';

const { SENT_COUNT, TOPICS, MAX_CHARS } = SENTENCE_QUERY_KEYS;

export const getRandomSentence = [
  checkMaxCharField,
  checkTopicsField,
  checkSentenceCountField,
  handleValidationErrors,
  asyncHandler<ParamsDictionary, unknown, unknown, SentenceQuery>(
    async (req, res) => {
      const { sent_count, topics, max_chars } = req.query;

      const template = await fetchPromptTemplate();
      if (!template) return throwCustomError('Failed to get template', 500);

      const prompt = replaceTemplateValues(
        template,
        sent_count,
        topics.join(', '),
        max_chars,
      );

      const sentence = await fetchSentenceFromOpenAI(prompt);
      if (!sentence) throwCustomError('Failed to generate sentence', 500);

      res.status(200).json({ sentence });
    },
  ),
];

const fetchPromptTemplate = async () => {
  const template = await redis.get(ANALYSIS_REDIS_KEYS.PROMPT_SENTENCE);
  return template || null;
};

const replaceTemplateValues = (
  template: string,
  count: string,
  topics: string,
  chars: string,
) => {
  return template
    .replace(`{${SENT_COUNT}}`, count)
    .replace(`{${TOPICS}}`, topics)
    .replace(`{${MAX_CHARS}}`, chars);
};

const fetchSentenceFromOpenAI = async (prompt: string) => {
  try {
    const completion = await openai.createChatCompletion({
      model: MODEL_GPT_3_5,
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7,
    });

    return completion.data.choices?.[0]?.message?.content || null;
  } catch (error) {
    throwCustomError('OpenAI service error', 500);
  }
};

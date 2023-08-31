import { ANALYSIS_DECREMENT_COUNT, ERROR_MESSAGES } from '@/constants';
import { asyncHandler, throwCustomError } from '@/utils';
import {
  ANALYZER_REDIS_SCHEMA,
  decrementRedisCounters,
  getAnalysisModel,
  GPTModel,
  redis,
} from '@/services';
import { checkModelField, checkSentenceField } from '@/validators';
import { handleValidationErrors, validateAnalysisCount } from '@/middlewares';
import { HumanMessage, SystemMessage } from 'langchain/schema';
import { ChatOpenAI } from 'langchain/chat_models/openai';

type RequestBody = { sentence: string[]; model: GPTModel };

const { RETRIEVE_FAILED, GENERATE_FAILED } = ERROR_MESSAGES;
const { KEYS, FIELDS } = ANALYZER_REDIS_SCHEMA;

export const createAnalysis = [
  checkSentenceField,
  checkModelField,
  validateAnalysisCount,
  handleValidationErrors,
  asyncHandler(async (req, res) => {
    // validateClientIP 미들웨어에서 검증하므로 항상 존재
    const clientIP = req.clientIP as string;
    const { sentence, model }: RequestBody = req.body;

    const analysis = await executeAnalysis(JSON.stringify(sentence), model);

    await decrementRedisCounters(
      [KEYS.REMAINING.TOTAL, KEYS.REMAINING.USER(clientIP)],
      FIELDS.ANALYSIS,
      ANALYSIS_DECREMENT_COUNT[model],
    );

    res.status(200).json(JSON.parse(analysis));
  }),
];

const retrieveAnalysisPrompt = async () => {
  const prompt = await redis.hget(KEYS.PROMPT, FIELDS.ANALYSIS);
  if (!prompt) return throwCustomError(RETRIEVE_FAILED('prompt'), 500);

  return prompt;
};

const executeAnalysis = async (sentence: string, model: GPTModel) => {
  const prompt = await retrieveAnalysisPrompt();

  const modelName = getAnalysisModel(model);
  const chat = new ChatOpenAI({ modelName, temperature: 0.4 });

  const messages = [new SystemMessage(prompt), new HumanMessage(sentence)];
  const { content } = await chat.call(messages);

  if (!content) return throwCustomError(GENERATE_FAILED('analysis'), 500);
  return content;
};

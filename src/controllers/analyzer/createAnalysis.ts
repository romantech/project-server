import { ANALYSIS_DECREMENT_COUNT, ERROR_MESSAGES } from '@/constants';
import { asyncHandler, throwCustomError } from '@/utils';
import {
  ANALYSIS_MODEL_OPTIONS,
  ANALYZER_REDIS_SCHEMA,
  decrementRedisCounters,
  GPTModel,
  redis,
  validateAndRepairJSON,
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
    const clientIP = req.clientIP as string; // validateClientIP 미들웨어에서 검증하므로 항상 존재
    const { sentence, model }: RequestBody = req.body;

    const analysis = await executeAnalysis(JSON.stringify(sentence), model);

    await decrementRedisCounters(
      [KEYS.REMAINING.TOTAL, KEYS.REMAINING.USER(clientIP)],
      FIELDS.ANALYSIS,
      ANALYSIS_DECREMENT_COUNT[model],
    );

    res.status(200).json(analysis);
  }),
];

const retrieveAnalysisPrompt = async (model: GPTModel) => {
  const { promptField } = ANALYSIS_MODEL_OPTIONS[model];
  const prompt = await redis.hget(KEYS.PROMPT, promptField);

  if (!prompt) return throwCustomError(RETRIEVE_FAILED('prompt'), 500);

  return prompt;
};

const executeAnalysis = async (sentence: string, model: GPTModel) => {
  const { temperature, modelName } = ANALYSIS_MODEL_OPTIONS[model];
  const prompt = await retrieveAnalysisPrompt(model);
  const messages = [new SystemMessage(prompt), new HumanMessage(sentence)];

  const chat = new ChatOpenAI({ modelName, temperature });
  const { content } = await chat.call(messages);

  if (!content) return throwCustomError(GENERATE_FAILED('analysis'), 500);
  return await validateAndRepairJSON(content);
};

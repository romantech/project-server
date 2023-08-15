import {
  ERROR_MESSAGES,
  GPTModels,
  MODEL_GPT_3_5,
  MODEL_GPT_4,
} from '@/constants';
import { asyncHandler, throwCustomError } from '@/utils';
import {
  decrementRedisCounters,
  fetchFromOpenAI,
  redis,
  REDIS_ANALYZER,
} from '@/services';
import { checkModelField, checkSentenceField } from '@/validators';
import { handleValidationErrors, validateAnalysisCount } from '@/middlewares';

type RequestBody = { sentence: string[]; model: GPTModels };

const { RETRIEVE_FAILED, GENERATE_FAILED } = ERROR_MESSAGES;
const { KEYS, FIELDS } = REDIS_ANALYZER;

export const createAnalysis = [
  checkSentenceField,
  checkModelField,
  validateAnalysisCount,
  handleValidationErrors,
  asyncHandler(async (req, res) => {
    // validateClientIP 미들웨어에서 검증하므로 항상 존재
    const clientIP = req.clientIP as string;
    const { sentence, model }: RequestBody = req.body;

    const prompt = await redis.hget(KEYS.PROMPT, FIELDS.ANALYSIS);
    if (!prompt) return throwCustomError(RETRIEVE_FAILED('prompt'), 500);

    const analysis = await fetchAnalysisFromOpenAI(sentence, model, prompt);
    if (!analysis) return throwCustomError(GENERATE_FAILED('analysis'), 500);

    await decrementRedisCounters(
      [KEYS.REMAINING.TOTAL, KEYS.REMAINING.USER(clientIP)],
      FIELDS.ANALYSIS,
      getDecrementValue(model),
    );

    res.status(200).json(JSON.parse(analysis));
  }),
];

const getDecrementValue = (model: GPTModels) => {
  const DECREMENT_VALUES = { [MODEL_GPT_4]: 3, [MODEL_GPT_3_5]: 1 };
  return DECREMENT_VALUES[model];
};

const fetchAnalysisFromOpenAI = async (
  sentence: string[],
  model: string,
  prompt: string,
) => {
  return fetchFromOpenAI({
    model,
    messages: [
      { role: 'system', content: prompt },
      { role: 'user', content: JSON.stringify(sentence) },
    ],
    temperature: 0.4,
  });
};

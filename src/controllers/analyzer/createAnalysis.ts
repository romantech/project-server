import { ERROR_MESSAGES, GPTModel, GPTModels } from '@/constants';
import { asyncHandler, throwCustomError } from '@/utils';
import {
  ANALYZER_REDIS_SCHEMA,
  decrementRedisCounters,
  fetchFromOpenAI,
  getFineTunedModel,
  redis,
} from '@/services';
import { checkModelField, checkSentenceField } from '@/validators';
import { handleValidationErrors, validateAnalysisCount } from '@/middlewares';

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

    const prompt = await redis.hget(KEYS.PROMPT, FIELDS.ANALYSIS);
    if (!prompt) return throwCustomError(RETRIEVE_FAILED('prompt'), 500);

    const fineTuned = getFineTunedModel(model);
    const analysis = await fetchAnalysisFromOpenAI(sentence, fineTuned, prompt);
    if (!analysis) return throwCustomError(GENERATE_FAILED('analysis'), 500);

    await decrementRedisCounters(
      [KEYS.REMAINING.TOTAL, KEYS.REMAINING.USER(clientIP)],
      FIELDS.ANALYSIS,
      getDecrementValue(model),
    );

    res.status(200).json(JSON.parse(analysis));
  }),
];

const getDecrementValue = (model: GPTModel) => {
  const DECREMENT_VALUES = { [GPTModels.GPT_4]: 5, [GPTModels.GPT_3]: 1 };
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

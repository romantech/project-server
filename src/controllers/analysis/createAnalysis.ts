import {
  ERROR_MESSAGES,
  GPTModels,
  MODEL_GPT_3_5,
  MODEL_GPT_4,
} from '@/constants';
import { asyncHandler, throwCustomError } from '@/utils';
import { ANALYSIS_REDIS_KEYS, fetchFromOpenAI, redis } from '@/services';
import { checkModelField, checkSentenceField } from '@/validators';
import { handleValidationErrors, validateAnalysisCount } from '@/middlewares';
import { validateClientIP } from '@/middlewares/validateClientIP';

type RequestBody = { sentence: string[]; model: GPTModels };

const { TOTAL_COUNT, COUNT_BY_IP, PROMPT_ANALYSIS } = ANALYSIS_REDIS_KEYS;
const { RETRIEVE_FAILED, GENERATE_FAILED } = ERROR_MESSAGES;

export const createAnalysis = [
  checkSentenceField,
  checkModelField,
  validateClientIP,
  validateAnalysisCount,
  handleValidationErrors,
  asyncHandler(async (req, res) => {
    const clientIP = req.clientIP as string; // validateClientIP 미들웨어에서 검증하므로 항상 존재
    const { sentence, model }: RequestBody = req.body;
    const decValue = getDecrementValue(model);

    const prompt = await redis.get(PROMPT_ANALYSIS);
    if (!prompt) return throwCustomError(RETRIEVE_FAILED('prompt'), 500);

    const analysis = await fetchAnalysisFromOpenAI(sentence, model, prompt);
    if (!analysis) return throwCustomError(GENERATE_FAILED('analysis'), 500);

    await decrementRedisCounters(clientIP, decValue);
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

const decrementRedisCounters = async (clientIP: string, decValue: number) => {
  /**
   * Redis Multi 기능(트랜젝션과 유사)을 사용해 데이터의 일관성/무결성 보장.
   * 트랜젝션은 DB 작업 단위 중 하나로 일련의 연산을 하나로 묶는 것을 의미
   * 이를 통해 모든 연산이 성공적으로 이뤄져야만 전체 작업을 확정(커밋)할 수 있음
   * */
  const multi = redis.multi();
  multi.decrby(TOTAL_COUNT, decValue);
  multi.decrby(COUNT_BY_IP(clientIP), decValue);
  await multi.exec();
};

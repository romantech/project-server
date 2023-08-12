import { ERROR_MESSAGES, GPT_MODELS, MODEL_GPT_4 } from '@/constants';
import { asyncHandler, throwCustomError } from '@/utils';
import {
  ANALYSIS_REDIS_KEYS,
  openai,
  OPENAI_SETTINGS,
  redis,
} from '@/services';
import { checkModelField, checkSentenceField } from '@/validators';
import { handleValidationErrors, validateAnalysisCount } from '@/middlewares';
import { validateClientIP } from '@/middlewares/validateClientIP';

type RequestBody = { sentence: string[]; model: (typeof GPT_MODELS)[number] };

const { TOTAL_COUNT, COUNT_BY_IP, PROMPT_ANALYSIS } = ANALYSIS_REDIS_KEYS;
const { ANALYSIS_PARSE_ERROR } = ERROR_MESSAGES;

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

    const prompt = (await redis.get(PROMPT_ANALYSIS)) as string;
    const completion = await processOpenAICompletion(sentence, model, prompt);
    await processRedisDecrement(clientIP, decValue);

    const analysis = completion.data.choices?.[0]?.message?.content;
    if (analysis) res.status(200).json(JSON.parse(analysis));
    else throwCustomError(ANALYSIS_PARSE_ERROR, 502);
  }),
];

const getDecrementValue = (model: string) => {
  switch (model) {
    case MODEL_GPT_4:
      return 3;
    default:
      return 1;
  }
};

const processOpenAICompletion = async (
  sentence: string[],
  model: string,
  prompt: string,
) => {
  return await openai.createChatCompletion({
    model,
    messages: [
      { role: 'system', content: prompt },
      { role: 'user', content: JSON.stringify(sentence) },
    ],
    ...OPENAI_SETTINGS,
  });
};

const processRedisDecrement = async (clientIP: string, decValue: number) => {
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

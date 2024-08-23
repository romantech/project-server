import { logger } from '@/config';
import { ChatOpenAI } from '@langchain/openai';
import { throwCustomError } from '@/utils/customError';
import { AI_MODEL, AIModelKey } from '@/services';
import { JsonOutputParser } from '@langchain/core/output_parsers';
import { ChatPromptTemplate } from '@langchain/core/prompts';

export const jsonOutputParser = new JsonOutputParser();

const repairJSONWithOpenAI = async (jsonString: string) => {
  logger.info('Trying to repair JSON using OpenAI');

  const model = new ChatOpenAI({
    temperature: 0,
    modelName: AI_MODEL[AIModelKey.GPT_4O_MINI],
    modelKwargs: { response_format: { type: 'json_object' } },
  });

  const prompt = ChatPromptTemplate.fromTemplate(
    'Fix JSON format and the results should be returned in JSON: {jsonString}',
  );

  const chain = prompt.pipe(model).pipe(jsonOutputParser);
  return await chain.invoke({ jsonString });
};

export const validateAndRepairJSON = async (jsonString: string) => {
  try {
    return JSON.parse(jsonString);
  } catch (e) {
    logger.warn(`Failed to parse initial JSON. ${e}`);

    try {
      return await repairJSONWithOpenAI(jsonString);
    } catch (openAIError) {
      logger.warn(`Failed to repair JSON using OpenAI. ${openAIError}`);
      throwCustomError('Failed to parse and repair JSON.', 500);
    }
  }
};

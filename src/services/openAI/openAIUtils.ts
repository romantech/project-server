import { logger } from '@/config';
import { OpenAI } from '@langchain/openai';
import { throwCustomError } from '@/utils/customError';
import { AI_MODEL, AIModelKey } from '@/services';

/**
 * When using fine-tuned model, there's a recurring issue where unnecessary ']' and '}' are added.
 * This results in a predictable parsing error.
 * so only remove the 'position' part mentioned in the error message.
 */
const repairJSONManually = (jsonString: string, errorMessage: string) => {
  logger.info('Trying to repair JSON manually');

  const errorIndex = errorMessage.match(/\d+/)?.[0];
  if (!errorIndex) return jsonString;

  const repaired = jsonString.substring(0, parseInt(errorIndex, 10)) + '}';
  return JSON.parse(repaired);
};

const repairJSONWithOpenAI = async (jsonString: string) => {
  logger.info('Trying to repair JSON using OpenAI');

  const llm = new OpenAI({
    temperature: 0,
    modelName: AI_MODEL[AIModelKey.GPT_3_5],
  });
  const prompt = `Fix JSON format and the results should be returned in JSON: ${jsonString}`;

  const repaired = await llm.invoke(prompt);
  return JSON.parse(repaired);
};

export const validateAndRepairJSON = async (jsonString: string) => {
  try {
    return JSON.parse(jsonString);
  } catch (e) {
    logger.warn(`Failed to parse initial JSON. ${e}`);

    try {
      const isSyntaxError = e instanceof SyntaxError;
      if (!isSyntaxError) return throwCustomError('Invalid JSON format');

      return repairJSONManually(jsonString, e.message);
    } catch (repairError) {
      logger.warn(`Failed to repair JSON manually. ${repairError}`);

      try {
        return await repairJSONWithOpenAI(jsonString);
      } catch (openAIError) {
        logger.warn(`Failed to repair JSON using OpenAI. ${openAIError}`);
        throwCustomError('Analysis Data Generation Error.', 500);
      }
    }
  }
};

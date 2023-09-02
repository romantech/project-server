import { logger } from '@/config';
import { OpenAI } from 'langchain/llms/openai';
import { throwCustomError } from '@/utils/customError';
import { GPTModels } from '@/services';

/**
 * When using fine-tuned model, there's a recurring issue where unnecessary ']' and '}' are added.
 * This results in a predictable parsing error.
 * so only remove the 'position' part mentioned in the error message.
 */
const repairJSONManually = (jsonString: string, errorMessage: string) => {
  logger.info('Trying to repair JSON manually');

  const errorIndex = errorMessage.match(/\d+/)?.[0];
  if (!errorIndex) return jsonString;

  return jsonString.substring(0, parseInt(errorIndex, 10)) + '}';
};

const repairJSONWithOpenAI = async (jsonString: string) => {
  logger.info('Trying to fix JSON using OpenAI');

  const llm = new OpenAI({ temperature: 0, modelName: GPTModels.GPT_3 });
  const prompt = `Fix JSON format and the results should be returned in JSON: ${jsonString}`;
  return await llm.predict(prompt);
};

export const validateAndRepairJSON = async (jsonString: string) => {
  try {
    return JSON.parse(jsonString);
  } catch (e) {
    logger.warn(`Failed to parse initial JSON. ${e}`);
    try {
      const isSyntaxError = e instanceof SyntaxError;
      if (!isSyntaxError) return throwCustomError('Invalid JSON format');

      const manualRepaired = repairJSONManually(jsonString, e.message);
      return JSON.parse(manualRepaired);
    } catch (repairError) {
      logger.warn(`Failed to parse manually repaired JSON. ${repairError}`);
      try {
        const openAIRepaired = await repairJSONWithOpenAI(jsonString);
        return JSON.parse(openAIRepaired);
      } catch (openAIError) {
        logger.warn(`Could not fix JSON using OpenAI. ${openAIError}`);
        throwCustomError('Analysis Data Generation Error.', 500);
      }
    }
  }
};

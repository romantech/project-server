import { logger } from '@/config';
import { ChatOpenAI, ChatOpenAIFields } from '@langchain/openai';
import { throwCustomError } from '@/utils/customError';
import { AI_MODEL, AIModelKey } from '@/services';
import { JsonOutputParser } from '@langchain/core/output_parsers';
import { jsonrepair } from 'jsonrepair';
import { OutputFixingParser } from 'langchain/output_parsers';

export const jsonOutputParser = new JsonOutputParser();

export const createJSONChatOpenAI = (config: ChatOpenAIFields) => {
  return new ChatOpenAI({
    ...config,
    modelKwargs: { response_format: { type: 'json_object' } },
  });
};

interface RepairStrategy {
  name: string;
  execute: (jsonString: string) => Promise<unknown>;
}

const strategies: RepairStrategy[] = [
  {
    name: 'Basic JSON.parse',
    execute: async (json) => JSON.parse(json),
  },
  {
    name: 'jsonrepair',
    execute: async (json) => {
      const repaired = jsonrepair(json);
      return JSON.parse(repaired);
    },
  },
  {
    name: 'OutputFixingParser',
    execute: async (json) => {
      const jsonOutputLLM = createJSONChatOpenAI({
        temperature: 0,
        model: AI_MODEL[AIModelKey.GPT_4O_MINI],
      });

      const outputParser = OutputFixingParser.fromLLM(
        jsonOutputLLM,
        jsonOutputParser,
      );
      return await outputParser.parse(json);
    },
  },
];

export const validateAndRepairJSON = async (jsonString: string) => {
  for (const strategy of strategies) {
    try {
      logger.info(`Trying ${strategy.name}`);
      const result = await strategy.execute(jsonString);
      logger.info(`${strategy.name} succeeded`);
      return result;
    } catch (error) {
      logger.warn(`${strategy.name} failed: ${error}`);
    }
  }

  logger.error('All JSON repair strategies failed');
  throwCustomError(
    'Failed to parse and repair JSON with all available methods.',
    500,
  );
};

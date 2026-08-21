require('module-alias/register');

const assert = require('node:assert/strict');
const { test } = require('node:test');
const express = require('express');

const servicesPath = require.resolve('../dist/services');
const openAIPath = require.resolve('@langchain/openai');
let llmCalls = 0;

require.cache[servicesPath] = {
  exports: {
    AIModelKey: {
      FAST: 'fast',
      PRIMARY: 'primary',
      FAST_FT: 'fast-ft',
      PRIMARY_FT: 'primary-ft',
    },
    ANALYSIS_MODEL: [],
    ANALYZER_REDIS_SCHEMA: {
      KEYS: {
        PROMPT: 'prompt',
        REMAINING: { TOTAL: 'total', USER: (ip) => `user:${ip}` },
      },
      FIELDS: { ANALYSIS: 'analysis', RANDOM_SENTENCE: 'random_sentence' },
    },
    RANDOM_SENTENCE_CONFIG: {},
    decrementRedisCounters: async () => {},
    redis: {
      hget: async () =>
        'Generate {sent_count} sentences with up to {max_chars} characters about {topics}',
    },
  },
};
require.cache[openAIPath] = {
  exports: {
    ChatOpenAI: class {
      withStructuredOutput() {
        return {
          invoke: async () => {
            llmCalls += 1;
            return { sentences: ['Generated sentence.'] };
          },
        };
      }
    },
  },
};

const {
  getRandomSentences,
} = require('../dist/controllers/analyzer/getRandomSentences');

test('uses sanitized defaults for omitted query parameters', async (context) => {
  const [maxChars, topics, sentenceCount, , validationErrors, handler] =
    getRandomSentences;
  const app = express();
  app.get(
    '/analyzer/random-sentences',
    maxChars,
    topics,
    sentenceCount,
    (req, _res, next) => {
      req.clientIP = '127.0.0.1';
      next();
    },
    validationErrors,
    handler,
  );
  app.use((error, _req, res, _next) => {
    res.status(500).json({ error: error.message });
  });

  const server = await new Promise((resolve, reject) => {
    const listener = app.listen(0, (error) => {
      if (error) reject(error);
      else resolve(listener);
    });
  });
  context.after(() => server.close());

  const address = server.address();
  assert(address && typeof address !== 'string');
  const response = await fetch(
    `http://127.0.0.1:${address.port}/analyzer/random-sentences?sent_count=3`,
  );

  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), ['Generated sentence.']);
  assert.equal(llmCalls, 1);
});

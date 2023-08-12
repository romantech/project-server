import { body } from 'express-validator';
import { ERROR_MESSAGES, GPT_MODELS } from '@/constants';

const { MISSING_FIELD } = ERROR_MESSAGES;

export const checkSentenceField = body('sentence')
  .isArray({ min: 2, max: 20 })
  .withMessage(MISSING_FIELD('sentence'));

export const checkModelField = body('model')
  .isIn(GPT_MODELS)
  .withMessage(
    `Invalid model value. Allowed values are '${GPT_MODELS.join(', ')}'`,
  );

import { body } from 'express-validator';
import { ERROR_MESSAGES, GPT_MODELS } from '@/constants';

const { ANALYSIS_MISSING_FIELDS, ANALYSIS_INVALID_MODEL } = ERROR_MESSAGES;

export const checkSentenceField = body('sentence')
  .isArray({ min: 2, max: 20 })
  .withMessage(ANALYSIS_MISSING_FIELDS(['sentence']));

export const checkModelField = body('model')
  .isIn(GPT_MODELS)
  .withMessage(ANALYSIS_INVALID_MODEL(GPT_MODELS));

export const checkFingerprintField = body('fingerprint')
  .notEmpty()
  .withMessage(ANALYSIS_MISSING_FIELDS(['fingerprint']));

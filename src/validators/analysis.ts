import { body } from 'express-validator';
import { GPT_MODELS } from '@/services';
import { ERROR_MESSAGES } from '@/constants';

const { ANALYSIS_INVALID_REQUEST, ANALYSIS_INVALID_MODEL } = ERROR_MESSAGES;

export const checkSentence = body('sentence')
  .isArray({ min: 2, max: 20 })
  .withMessage(ANALYSIS_INVALID_REQUEST(['sentence']));

export const checkModel = body('model')
  .isIn(GPT_MODELS)
  .withMessage(ANALYSIS_INVALID_MODEL(GPT_MODELS));

export const checkFingerprint = body('fingerprint')
  .notEmpty()
  .withMessage(ANALYSIS_INVALID_REQUEST(['fingerprint']));

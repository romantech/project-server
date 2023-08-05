import { CustomError } from '@/utils';
import { ERROR_MESSAGES } from '@/constants';

export const notFoundHandler = () => {
  throw new CustomError(404, ERROR_MESSAGES.NOT_FOUND);
};

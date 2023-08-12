import { throwCustomError } from '@/utils';
import { ERROR_MESSAGES } from '@/constants';

export const notFoundHandler = () => {
  throwCustomError(ERROR_MESSAGES.NOT_FOUND, 404);
};

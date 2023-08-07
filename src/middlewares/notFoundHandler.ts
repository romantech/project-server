import { throwCustomError } from '@/utils';
import { ERROR_MESSAGES } from '@/constants';

export const notFoundHandler = () => {
  throwCustomError(ERROR_MESSAGES.RESOURCE_NOT_FOUND, 404);
};

import { CustomError } from '@/utils';
import { ERROR_MESSAGES } from '@/constants';

const notFoundHandler = () => {
  throw new CustomError(404, ERROR_MESSAGES.NOT_FOUND);
};

export default notFoundHandler;

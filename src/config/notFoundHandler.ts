import { CustomError } from '@/utils/customError';
import { ERROR_MESSAGES } from '@/utils/errorMessages';

const notFoundHandler = () => {
  throw new CustomError(404, ERROR_MESSAGES.NOT_FOUND);
};

export default notFoundHandler;

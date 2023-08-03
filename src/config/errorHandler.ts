import { NextFunction, Request, Response } from 'express';

type ResponseType = {
  status: string;
  message: string;
  error?: string;
};

const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  console.error(err.stack);

  const response: ResponseType = {
    status: 'error',
    message: 'Internal Server Error',
  };

  if (process.env.NODE_ENV === 'development') {
    response.error = err.message;
  }

  res.status(500).json(response);
};

export default errorHandler;

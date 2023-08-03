import { Request, Response } from 'express';

const notFoundHandler = (req: Request, res: Response) => {
  res.status(404).json({
    status: 'error',
    message: `The requested resource '${req.originalUrl}' was not found on this server. Please check your request URL and try again.`,
  });
};

export default notFoundHandler;

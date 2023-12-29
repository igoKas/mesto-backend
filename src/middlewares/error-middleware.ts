import { Request, Response, NextFunction } from 'express';
import ApiError from '../exceptions/api-error';

// eslint-disable-next-line no-unused-vars
export default function handleError(err: Error, req: Request, res: Response, next: NextFunction) {
  if (err instanceof ApiError) {
    return res.status(err.status).json({ message: err.message, errors: err.errors });
  }
  return res.status(500).json({ message: 'Unexpected error' });
}

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import ApiError from '../exceptions/api-error';

export default (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies.jwt?.replace('Bearer ', '');
    if (!token) {
      throw ApiError.Unauthorized();
    }
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'jwt-secret-key');
    if (!payload) {
      throw ApiError.Unauthorized();
    }
    req.user = payload as { _id: string };
    next();
  } catch (error) {
    next(error);
  }
};

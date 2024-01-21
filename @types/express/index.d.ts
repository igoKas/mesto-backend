/* eslint-disable no-shadow */
/* eslint-disable no-unused-vars */
import { Request } from 'express';

declare global {
  namespace Express {
    interface Request {
      user: { _id: string };
    }
  }
}

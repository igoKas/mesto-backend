import { ValidationError } from 'express-validator';

class ApiError extends Error {
  status: number;

  errors: string[] | ValidationError[];

  constructor(status: number, message: string, errors: string[] | ValidationError[] = []) {
    super(message);
    this.status = status;
    this.errors = errors;
  }

  static UnauthorizedError() {
    return new ApiError(401, 'User is not authorized');
  }

  static BadRequest(message: string, errors: string[] | ValidationError[] = []) {
    return new ApiError(400, message, errors);
  }

  static NotFound(message: string, errors: string[] | ValidationError[] = []) {
    return new ApiError(404, message, errors);
  }
}

export default ApiError;

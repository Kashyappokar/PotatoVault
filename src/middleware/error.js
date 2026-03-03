import { ZodError } from 'zod';
import { ApiError } from '../utils/ApiErrors.js';

export function errorHandler(err, req, res, next) {
  if (err instanceof ZodError) {
    const apiErr = ApiError.validationError('Validation Error!', err.errors);
    return ApiError.errorHandler(apiErr, req, res, next);
  }
  return ApiError.errorHandler(err, req, res, next);
}

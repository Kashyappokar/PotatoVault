import { ZodError } from 'zod';
import { ApiError } from '../utils/ApiErrors.js';

export const errorHandler = (err, req, res, _next) => {
  let error = err;

  // 🔹 Zod validation errors
  if (error instanceof ZodError) {
    const issues = error.issues || [];
    const firstIssue = issues[0];

    const field = firstIssue?.path?.join('.') || 'unknown';
    const message = firstIssue?.message || 'Validation error';

    error = ApiError.badRequest(message, field);
  }

  // 🔹 Mongoose duplicate key error
  else if (error.code === 11000) {
    const field = Object.keys(error.keyValue)[0];

    error = ApiError.conflict(`${field} already exists`, field);
  }

  // 🔹 Unknown errors
  else if (!(error instanceof ApiError)) {
    error = ApiError.internal(error.message || 'Internal Server Error');
  }

  res.status(error.statusCode).json(error.toJSON());
};

import { ZodError } from 'zod'
import { ApiError } from '../utils/ApiErrors.js'

export const errorHandler = (err, req, res, _next) => {
  let error = err

  // 🔹 Zod validation errors
  if (error instanceof ZodError) {
    const issues = error.issues || error.errors || []

    error = ApiError.badRequest(
      'Validation Error',
      issues.map((issue) => ({
        field: issue.path?.join('.') ?? 'unknown',
        message: issue.message
      }))
    )
  }

  // 🔹 Mongoose duplicate key error
  else if (error.code === 11000) {
    const field = Object.keys(error.keyValue)[0]

    error = ApiError.conflict(`${field} already exists`, [
      {
        field,
        message: `${field} must be unique`
      }
    ])
  }

  // 🔹 Already an ApiError → leave it
  else if (!(error instanceof ApiError)) {
    error = ApiError.internal(error.message || 'Internal Server Error')
  }

  res.status(error.statusCode).json(error.toJSON())
}

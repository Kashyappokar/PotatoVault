import { ZodError } from 'zod'
import { ApiError } from '../utils/ApiErrors.js'

export function errorHandler(err, req, res, next) {
  if (err instanceof ZodError) {
    const zodIssues = err.issues?.map((i) => ({
      path: Array.isArray(i.path) ? i.path.join('.') : String(i.path),
      message: i.message,
      code: i.code
    }))
    const apiErr = ApiError.validationError('Validation Error', zodIssues)
      .withSource('validation:zod')
      .withRoute({ method: req.method, path: req.originalUrl })
    return ApiError.errorHandler(apiErr, req, res, next)
  }
  return ApiError.errorHandler(err, req, res, next)
}

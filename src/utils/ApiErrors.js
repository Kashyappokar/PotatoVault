/* eslint-disable no-console */
class ApiError extends Error {
  constructor(
    statusCode = 500,
    message = 'Internal Server Error',
    errors = null,
    isOperational = true
  ) {
    super(message)

    this.name = this.constructor.name
    this.success = false
    this.statusCode = statusCode
    this.message = message
    this.errors = errors
    this.isOperational = isOperational
    this.timestamp = new Date().toISOString()

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor)
    }
  }

  static badRequest(message = 'Bad Request', errors = null) {
    return new ApiError(400, message, errors)
  }

  static unauthorized(message = 'Unauthorized') {
    return new ApiError(401, message)
  }

  static forbidden(message = 'Forbidden') {
    return new ApiError(403, message)
  }

  static notFound(message = 'Resource not found') {
    return new ApiError(404, message)
  }

  static conflict(message = 'Conflict') {
    return new ApiError(409, message)
  }

  static validationError(message = 'Validation Error', errors = null) {
    return new ApiError(422, message, errors)
  }

  static internal(message = 'Internal Server Error', errors = null) {
    return new ApiError(500, message, errors, false)
  }

  static errorHandler(err, req, res, _next) {
    let error = err
    if (!(error instanceof ApiError)) {
      const statusCode = error.statusCode || 500
      const message = error.message || 'Internal Server Error'
      error = new ApiError(statusCode, message, null, false)
    }
    console.error(`${error.name}: ${error.message}`)
    if (process.env.NODE_ENV === 'development') {
      console.error(error.stack)
    }
    res.status(error.statusCode).json(error.toJSON())
  }

  toJSON() {
    return {
      success: false,
      statusCode: this.statusCode,
      message: this.message,
      errors: this.errors ?? [], // ✅ always an array
      timestamp: this.timestamp,
      ...(process.env.NODE_ENV === 'development' && {
        stack: this.stack?.split('\n').map((line) => line.trim())
      })
    }
  }
}

const errorHandler = (err, req, res, _next) => {
  let error = err

  if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode || 500
    const message = error.message || 'Internal Server Error'
    error = new ApiError(statusCode, message, null, false)
  }

  console.error(`${error.name}: ${error.message}`)
  if (process.env.NODE_ENV === 'development') {
    console.error(error.stack)
  }

  res.status(error.statusCode).json(error.toJSON())
}

export default {
  ApiError,
  errorHandler
}
export { ApiError, errorHandler }

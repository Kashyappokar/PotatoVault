/* eslint-disable no-console */
class ApiError extends Error {
  constructor(
    statusCode = 500,
    message = 'Internal Server Error',
    errors = null,
    isOperational = true,
    code = 'ERROR',
    source = null,
  ) {
    super(message);

    this.name = this.constructor.name;
    this.success = false;
    this.statusCode = statusCode;
    this.message = message;
    this.errors = errors;
    this.isOperational = isOperational;
    this.timestamp = new Date().toISOString();
    this.code = code;
    this.source = source;
    this.route = null;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  withCode(code) {
    this.code = code;
    return this;
  }

  withSource(source) {
    this.source = source;
    return this;
  }

  withRoute(route) {
    this.route = route;
    return this;
  }

  withErrors(errors) {
    this.errors = errors;
    return this;
  }

  static badRequest(message = 'Bad Request', errors = null) {
    return new ApiError(400, message, errors);
  }

  static unauthorized(message = 'Unauthorized', errors = null) {
    return new ApiError(401, message, errors).withCode('UNAUTHORIZED');
  }

  static forbidden(message = 'Forbidden', errors = null) {
    return new ApiError(403, message, errors).withCode('FORBIDDEN');
  }

  static notFound(message = 'Resource not found', errors = null) {
    return new ApiError(404, message, errors).withCode('NOT_FOUND');
  }

  static conflict(message = 'Conflict', errors = null) {
    return new ApiError(409, message, errors).withCode('CONFLICT');
  }

  static validationError(message = 'Validation Error', errors = null) {
    return new ApiError(422, message, errors).withCode('VALIDATION_ERROR');
  }

  static internal(message = 'Internal Server Error', errors = null) {
    return new ApiError(500, message, errors, false).withCode('INTERNAL_ERROR');
  }

  static errorHandler(err, req, res, _next) {
    let error = err;
    if (!(error instanceof ApiError)) {
      const statusCode = error.statusCode || 500;
      const message = error.message || 'Internal Server Error';
      error = new ApiError(statusCode, message, null, false).withCode(
        'INTERNAL_ERROR',
      );
    }
    const routeInfo = { method: req.method, path: req.originalUrl };
    if (!error.route) error.withRoute(routeInfo);

    if (!error.source) {
      const stack = error.stack || '';
      const match = stack.match(
        /src[\\/](controllers|services|middleware|routes)[\\/][^:)\n]+/i,
      );
      if (match) {
        const layer = match[0].split(/[\\/]/)[1];
        const file = match[0].split(/[\\/]/).slice(2).join('/');
        error.withSource(`${layer}:${file}`);
      } else {
        error.withSource('unknown');
      }
    }
    console.error(`${error.name}: ${error.message}`);
    if (process.env.NODE_ENV === 'development') {
      console.error(error.stack);
    }
    res.status(error.statusCode).json(error.toJSON());
  }

  toJSON() {
    const errorResponse = {
      success: this.success,
      statusCode: this.statusCode,
      message: this.message,
      timestamp: this.timestamp,
      code: this.code,
    };

    if (this.errors) {
      errorResponse.errors = this.errors;
    }

    if (this.source) {
      errorResponse.source = this.source;
    }

    if (this.route) {
      errorResponse.route = this.route;
    }

    if (process.env.NODE_ENV === 'development') {
      errorResponse.stack = this.stack?.split('\n').map((line) => line.trim());
    }

    return errorResponse;
  }
}

const errorHandler = (err, req, res, _next) => {
  let error = err;

  if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode || 500;
    const message = error.message || 'Internal Server Error';
    error = new ApiError(statusCode, message, null, false).withCode(
      'INTERNAL_ERROR',
    );
  }

  const routeInfo = { method: req.method, path: req.originalUrl };
  if (!error.route) error.withRoute(routeInfo);
  if (!error.source) error.withSource('unknown');

  console.error(`${error.name}: ${error.message}`);
  if (process.env.NODE_ENV === 'development') {
    console.error(error.stack);
  }

  res.status(error.statusCode).json(error.toJSON());
};

export default {
  ApiError,
  errorHandler,
};
export { ApiError, errorHandler };

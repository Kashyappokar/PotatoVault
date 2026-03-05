/* eslint-disable no-console */
class ApiError extends Error {
  constructor(
    statusCode = 500,
    message = 'Internal Server Error',
    field = null,
    isOperational = true,
    code = 'ERROR',
    source = null,
  ) {
    super(message);

    this.name = this.constructor.name;
    this.success = false;
    this.statusCode = statusCode;
    this.message = message;
    this.field = field;
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

  withField(field) {
    this.field = field;
    return this;
  }

  static badRequest(message = 'Bad Request', field = null) {
    return new ApiError(400, message, field);
  }

  static unauthorized(message = 'Unauthorized', field = null) {
    return new ApiError(401, message, field).withCode('UNAUTHORIZED');
  }

  static forbidden(message = 'Forbidden', field = null) {
    return new ApiError(403, message, field).withCode('FORBIDDEN');
  }

  static notFound(message = 'Resource not found', field = null) {
    return new ApiError(404, message, field).withCode('NOT_FOUND');
  }

  static conflict(message = 'Conflict', field = null) {
    return new ApiError(409, message, field).withCode('CONFLICT');
  }

  static validationError(message = 'Validation Error', field = null) {
    return new ApiError(422, message, field).withCode('VALIDATION_ERROR');
  }

  static internal(message = 'Internal Server Error', field = null) {
    return new ApiError(500, message, field, false).withCode('INTERNAL_ERROR');
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
    const payload = {
      success: false,
      message: this.message,
      field: this.field ?? null,
    };
    const stack =
      process.env.NODE_ENV === 'development'
        ? this.stack?.split('\n').map((line) => line.trim())
        : undefined;
    if (stack) payload.stack = stack;
    return payload;
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

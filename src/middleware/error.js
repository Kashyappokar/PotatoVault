import { ZodError } from 'zod'
import logger from '../utils/logger.js'

export function errorHandler(err, req, res, next) {
  if (err instanceof ZodError) {
    return res.status(400).json({ error: 'validation_error', issues: err.errors })
  }
  const status = err.status || 500
  const code = err.code || 'internal_error'
  const message = err.message || 'Internal Server Error'
  logger.error({ err, code, status }, message)
  res.status(status).json({ error: code, message })
}

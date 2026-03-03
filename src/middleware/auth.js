import jwt from 'jsonwebtoken'
import { env } from '../config/env.js'
import asyncHandler from '../utils/asyncHandler.js'
import { ApiError } from '../utils/ApiErrors.js'

export const requireAuth = asyncHandler(async (req, res, next) => {
  const header = req.headers.authorization || ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : null
  if (!token) {
    throw ApiError.unauthorized('Unauthorized', [
      { code: 'TOKEN_MISSING', location: 'header:Authorization' }
    ]).withSource('middleware:auth')
  }
  try {
    const payload = jwt.verify(token, env.JWT_SECRET)
    req.user = payload
    next()
  } catch (e) {
    const code = e?.name === 'TokenExpiredError' ? 'TOKEN_EXPIRED' : 'TOKEN_INVALID'
    throw ApiError.unauthorized('Unauthorized', [
      { code, location: 'header:Authorization' }
    ]).withSource('middleware:auth')
  }
})

import { z } from 'zod'
import * as AuthService from '../services/auth.service.js'
import ApiResponse from '../utils/ApiResponse.js'
import { ApiError } from '../utils/ApiErrors.js'
import asyncHandler from '../utils/asyncHandler.js'

const RegisterSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2),
  password: z.string().min(8)
})

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
})

export const register = asyncHandler(async (req, res) => {
  const data = RegisterSchema.parse(req.body)
  const result = await AuthService.register(data)
  res.status(201).json(ApiResponse.created(result))
})

export const login = asyncHandler(async (req, res) => {
  const data = LoginSchema.parse(req.body)
  const result = await AuthService.login(data)
  res.json(ApiResponse.success(result, 'Login successful'))
})

export const me = asyncHandler(async (req, res) => {
  const user = await AuthService.me(req.user.id)
  if (!user) throw ApiError.notFound('User not found')
  res.json(ApiResponse.success(user))
})

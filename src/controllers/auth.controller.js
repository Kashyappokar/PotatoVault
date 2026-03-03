import { z } from 'zod';
import * as AuthService from '../services/auth.service.js';
import ApiResponse from '../utils/ApiResponse.js';
import { ApiError } from '../utils/ApiErrors.js';
import asyncHandler from '../utils/asyncHandler.js';
import { Role } from '../utils/enums/role.enum.js';
import logger from '../utils/logger.js';

const RegisterSchema = z.object({
  email: z.string().email({ message: 'Invalid email format' }),
  name: z.string().min(2),
  password: z.string().min(8),
  role: z.enum(Object.values(Role)).default(Role.User),
  phone: z.string().min(10).max(10),
});

const LoginSchema = z.object({
  email: z.string().email({ message: 'Invalid email format' }),
  password: z.string().min(8),
});

export const register = asyncHandler(async (req, res) => {
  const data = RegisterSchema.parse(req.body);
  const result = await AuthService.register(data);
  res
    .status(201)
    .json(ApiResponse.created(result, 'User registered successfully'));
});

export const login = asyncHandler(async (req, res) => {
  const data = LoginSchema.parse(req.body);
  const result = await AuthService.login(data);
  res.json(ApiResponse.success(result, 'Login successful'));
});

export const me = asyncHandler(async (req, res) => {
  const user = await AuthService.me(req.user.id);
  if (!user) {
    logger.error({ id: req.user.id }, 'User not found');
    throw ApiError.notFound('User not found');
  }
  res.json(ApiResponse.success(user));
});

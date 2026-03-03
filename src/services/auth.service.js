import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { User } from '../models/user.model.js';
import { ApiError } from '../utils/ApiErrors.js';
import logger from '../utils/logger.js';

export async function register({ email, name, password, phone }) {
  const existing = await User.findOne({ email });
  if (existing) {
    logger.error({ email }, 'Email already registered');
    throw ApiError.conflict('Email already registered');
  }
  const hash = await bcrypt.hash(password, 10);
  const user = await User.create({ email, name, password: hash, phone });
  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
      farmerCode: user.farmerCode,
    },
    env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    },
  );
  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      phone: user.phone,
      role: user.role,
      farmerCode: user.farmerCode,
    },
  };
}

export async function login({ email, password }) {
  const user = await User.findOne({ email });
  if (!user) {
    logger.error({ email }, 'Invalid email');
    throw ApiError.unauthorized('Invalid email');
  }
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) {
    logger.error({ password }, 'Invalid password');
    throw ApiError.unauthorized('Invalid password');
  }
  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d',
    },
  );

  if (!token) {
    logger.error({ email }, 'Token generation failed');
    throw ApiError.internalServerError('Token generation failed');
  }
  return {
    token,
    user: { id: user.id, email: user.email, name: user.name, role: user.role },
  };
}

export async function me(id) {
  const user = await User.findById(id).select('name email role');
  if (!user) {
    logger.error({ id }, 'User not found');
    return null;
  }
  return { id: user.id, email: user.email, name: user.name };
}

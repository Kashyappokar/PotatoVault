import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { env } from '../config/env.js'
import { User } from '../models/user.model.js'
import { ApiError } from '../utils/ApiErrors.js'

export async function register({ email, name, password }) {
  const existing = await User.findOne({ email })
  if (existing) {
    throw ApiError.conflict('Email already in use')
  }
  const hash = await bcrypt.hash(password, 10)
  const user = await User.create({ email, name, password: hash })
  const token = jwt.sign({ id: user.id, email: user.email }, env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  })
  return { token, user: { id: user.id, email: user.email, name: user.name } }
}

export async function login({ email, password }) {
  const user = await User.findOne({ email })
  if (!user) {
    throw ApiError.unauthorized('Invalid credentials')
  }
  const ok = await bcrypt.compare(password, user.password)
  if (!ok) {
    throw ApiError.unauthorized('Invalid credentials')
  }
  const token = jwt.sign({ id: user.id, email: user.email }, env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  })
  return { token, user: { id: user.id, email: user.email, name: user.name } }
}

export async function me(id) {
  const user = await User.findById(id).select('email name')
  if (!user) return null
  return { id: user.id, email: user.email, name: user.name }
}

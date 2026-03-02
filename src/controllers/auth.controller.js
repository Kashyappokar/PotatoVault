import { z } from 'zod'
import * as AuthService from '../services/auth.service.js'

const RegisterSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2),
  password: z.string().min(8)
})

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8)
})

export async function register(req, res, next) {
  try {
    const data = RegisterSchema.parse(req.body)
    const result = await AuthService.register(data)
    res.status(201).json(result)
  } catch (err) {
    next(err)
  }
}

export async function login(req, res, next) {
  try {
    const data = LoginSchema.parse(req.body)
    const result = await AuthService.login(data)
    res.json(result)
  } catch (err) {
    next(err)
  }
}

export async function me(req, res) {
  const user = await AuthService.me(req.user.id)
  res.json(user)
}

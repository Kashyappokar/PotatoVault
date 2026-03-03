import mongoose from 'mongoose'
import { Role } from '../utils/enums/role.enum.js'

const schema = new mongoose.Schema(
  {
    email: { type: String, unique: true, index: true, required: true },
    name: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, default: Role.User }
  },
  { timestamps: true }
)

export const User = mongoose.model('User', schema)

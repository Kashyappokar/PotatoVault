import mongoose from 'mongoose'

const schema = new mongoose.Schema(
  {
    email: { type: String, unique: true, index: true, required: true },
    name: { type: String, required: true },
    password: { type: String, required: true }
  },
  { timestamps: true }
)

export const User = mongoose.model('User', schema)

import mongoose from 'mongoose'

const schema = new mongoose.Schema(
  {
    symbol: { type: String, unique: true, index: true, required: true },
    name: { type: String, required: true },
    price: { type: Number, required: true }
  },
  { timestamps: true }
)

export const Stock = mongoose.model('Stock', schema)

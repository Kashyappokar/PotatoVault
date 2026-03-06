import mongoose from 'mongoose';
import { Role } from '../utils/enums/role.enum.js';
import { generateFarmerCode } from '../utils/helper/helper.user.js';

const schema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, unique: true },
    email: { type: String, unique: true, index: true, required: true },
    password: { type: String, required: true },
    role: { type: String, default: Role.User },
    stocks: { type: Array, default: [] },
    farmerCode: { type: String, unique: true },
  },
  { timestamps: true },
);
schema.pre('save', async function (next) {
  if (this.name) {
    this.farmerCode = await generateFarmerCode(this.name);
  }
  next();
});
export const User = mongoose.model('User', schema);

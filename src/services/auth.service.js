import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";
import { User } from "../models/user.model.js";

export async function register({ email, name, password }) {
  const existing = await User.findOne({ email });
  if (existing) {
    const err = new Error("Email already in use");
    err.status = 409;
    err.code = "email_in_use";
    throw err;
  }
  const hash = await bcrypt.hash(password, 10);
  const user = await User.create({ email, name, password: hash });
  const token = jwt.sign({ id: user.id, email: user.email }, env.JWT_SECRET, {
    expiresIn: "7d",
  });
  return { token, user: { id: user.id, email: user.email, name: user.name } };
}

export async function login({ email, password }) {
  const user = await User.findOne({ email });
  if (!user) {
    const err = new Error("Invalid credentials");
    err.status = 401;
    err.code = "invalid_credentials";
    throw err;
  }
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) {
    const err = new Error("Invalid credentials");
    err.status = 401;
    err.code = "invalid_credentials";
    throw err;
  }
  const token = jwt.sign({ id: user.id, email: user.email }, env.JWT_SECRET, {
    expiresIn: "7d",
  });
  return { token, user: { id: user.id, email: user.email, name: user.name } };
}

export async function me(id) {
  const user = await User.findById(id).select("email name");
  if (!user) return null;
  return { id: user.id, email: user.email, name: user.name };
}

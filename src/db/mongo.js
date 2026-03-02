import mongoose from "mongoose";
import logger from "../utils/logger.js";
import { env } from "../config/env.js";

console.log(env.MONGO_URL);
export async function connectMongo() {
  await mongoose.connect(env.MONGO_URL, {
    autoIndex: env.NODE_ENV !== "production",
  });
  logger.info("MongoDB connected");
}

import { config as load } from "dotenv";
import { z } from "zod";

load();

const EnvSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  PORT: z
    .string()
    .optional()
    .transform((v) => (v ? Number(v) : 3000))
    .pipe(z.number().min(1)),
  JWT_SECRET: z.string().min(16),
  MONGO_URL: z.string().url(),
  CORS_ORIGIN: z.string().optional(),
});

const parsed = EnvSchema.safeParse(process.env);

if (!parsed.success) {
  throw new Error(
    "Invalid environment: " + JSON.stringify(parsed.error.format()),
  );
}

export const env = parsed.data;

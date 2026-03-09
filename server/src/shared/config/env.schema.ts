import * as Joi from 'joi';

export const envSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'test', 'production')
    .default('development'),
  PORT: Joi.number().default(3000),
  JWT_SECRET: Joi.string().min(10).required(),
  PING_URL: Joi.string().uri().optional(),
  PING_INTERVAL_MS: Joi.number().min(5000).optional(),
});

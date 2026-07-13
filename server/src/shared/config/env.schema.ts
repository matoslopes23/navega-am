import * as Joi from 'joi';

export const envSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'test', 'production')
    .default('development'),
  PORT: Joi.number().default(3000),
  JWT_SECRET: Joi.string().when('NODE_ENV', {
    is: 'production',
    then: Joi.string().min(32).required(),
    otherwise: Joi.string().min(10).required(),
  }),
  DATABASE_URL: Joi.string().required(),
  DIRECT_URL: Joi.string().default(Joi.ref('DATABASE_URL')),
  CORS_ORIGINS: Joi.string().default(
    'http://localhost:8080,http://localhost:5173',
  ),
  SWAGGER_ENABLED: Joi.boolean().default(true),
  PING_URL: Joi.string().uri().optional(),
  PING_INTERVAL_MS: Joi.number().min(5000).optional(),

  // --- Novas variáveis do Redis ---
  REDIS_HOST: Joi.string().required(),
  REDIS_PORT: Joi.number().default(6379),
  REDIS_PASSWORD: Joi.string().optional().allow(''), // Opcional no Docker local, obrigatório na nuvem
});

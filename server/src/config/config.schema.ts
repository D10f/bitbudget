import * as Joi from 'joi';

export const configValidationSchema = Joi.object({
  PORT: Joi.number().default(80),
  DOMAIN: Joi.string().default('http://localhost'), // used in production to restrict CORS origin
  MONGO_URI: Joi.string().required(),
  JWT_SECRET: Joi.string().required(),
  JWT_EXPIRE: Joi.number().required(),
});
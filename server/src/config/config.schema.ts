import * as Joi from 'joi';

export const configValidationSchema = Joi.object({
  MODE: Joi.string().default('development'),
  PORT: Joi.number().default(3000),
  DOMAIN: Joi.string().default('http://localhost'),
  MONGO_URI: Joi.string().required(),
  JWT_SECRET: Joi.string().required(),
  JWT_EXPIRE: Joi.number().required(),
});
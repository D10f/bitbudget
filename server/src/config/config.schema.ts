import * as Joi from 'joi';

export const configValidationSchema = Joi.object({
  MONGODB_NAME: Joi.string().required(),
  MONGODB_USER: Joi.string().required(),
  MONGODB_PASSWORD: Joi.string().required(),
  JWT_SECRET: Joi.string().required(),
  JWT_EXPIRE: Joi.number().required(),
});
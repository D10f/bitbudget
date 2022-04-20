import * as Joi from 'joi';

export const configValidationSchema = Joi.object().keys({
  MONGODB_NAME: Joi.when('MONGODB_NAME_FILE', {
    is: Joi.exist(),
    then: Joi.forbidden(),
    otherwise: Joi.string().required(),
  }),
  MONGODB_USER: Joi.when('MONGODB_USER_FILE', {
    is: Joi.exist(),
    then: Joi.forbidden(),
    otherwise: Joi.string().required(),
  }),
  MONGODB_PASSWORD: Joi.when('MONGODB_PASSWORD_FILE', {
    is: Joi.exist(),
    then: Joi.forbidden(),
    otherwise: Joi.string().required(),
  }),
  JWT_SECRET: Joi.when('JWT_SECRET_FILE', {
    is: Joi.exist(),
    then: Joi.forbidden(),
    otherwise: Joi.string().required(),
  }),
  JWT_EXPIRE: Joi.when('JWT_EXPIRE_FILE', {
    is: Joi.exist(),
    then: Joi.forbidden(),
    otherwise: Joi.number().default(3600),
  }),
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),
  PORT: Joi.number().default(80),
  DOMAIN: Joi.string().default('http://localhost'),
});
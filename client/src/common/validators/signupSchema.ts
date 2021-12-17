import * as Joi from "joi";
import { ref } from "joi";

export const signupValidationSchema = Joi.object().keys({
  username: Joi.string().min(2).required(),
  email: Joi.string().email({ tlds: { allow: false }}),
  password: Joi.string().min(8).required(),
  confirmPassword: Joi.string().equal(ref('password')),
});

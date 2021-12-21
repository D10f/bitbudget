import * as Joi from "joi";
import { ref } from "joi";

export const profileValidationSchema = Joi.object().keys({
  username: Joi.string().min(2).optional(),
  email: Joi.string().email({ tlds: { allow: false }}).optional(),
  password: Joi.string().min(8).optional(),
  confirmPassword: Joi.string().equal(ref('password')).optional(),
});

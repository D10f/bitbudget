import * as Joi from "joi";
import { ref } from "joi";

export const loginValidationSchema = Joi.object().keys({
  username: Joi.string().min(2).required(),
  password: Joi.string().min(8).required(),
});

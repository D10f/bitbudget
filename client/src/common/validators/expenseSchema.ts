import * as Joi from "joi";

export const expenseValidationSchema = Joi.object().keys({
  name: Joi.string().required(),
  amount: Joi.string().required(),
  description: Joi.string(),
  category: Joi.string(),
});

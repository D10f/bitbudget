import * as Joi from "joi";

export const expenseValidationSchema = Joi.object().keys({
  name: Joi.string().min(2).required(),
  amount: Joi.string().pattern(/^-?\d+(\.\d{0,2})?$/).required(),
  description: Joi.string().max(250),
  category: Joi.string().required(),
});

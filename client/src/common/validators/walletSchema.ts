import * as Joi from "joi";

export const walletValidationSchema = Joi.object().keys({
  name: Joi.string(),
  currency: Joi.string().valid(
    "EUR",
    "USD",
    "GBP",
    "AUD",
    "SGP",
    "JPY",
    "CNY",
    "INR"
  ),
  budget: Joi.string().pattern(/^\d+(\.\d{1,2})?$/),
});

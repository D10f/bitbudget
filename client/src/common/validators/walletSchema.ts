import * as Joi from "joi";

export const walletValidationSchema = Joi.object().keys({
  name: Joi.string().required(),
  currency: Joi.string().valid(
    "EUR",
    "USD",
    "GBP",
    "AUD",
    "SGP",
    "JPY",
    "CNY",
    "INR"
  ).required(),
  budget: Joi.string().pattern(/^\d+(\.\d{0,2})?$/).required(),
});

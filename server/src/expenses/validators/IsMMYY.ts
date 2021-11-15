import { buildMessage, ValidateBy, ValidationOptions } from 'class-validator';

const IS_MMYY = 'IsMMYY';
const MMYY_RE = new RegExp(/^(0[1-9]|1[0-2])(\d){2}$/);

/**
 * Checks if the string is a date formatted as MMYY e.g., 0521 -> May, 2021
 */
export function IsMMYY(validationOptions?: ValidationOptions) {
  return ValidateBy(
    {
      name: IS_MMYY,
      validator: {
        validate: function (value, args) {
          return MMYY_RE.test(value);
        },
        defaultMessage: buildMessage(function (eachPrefix) {
          return eachPrefix + '$property must be formatted as MMYY e.g., 0521 -> May, 2021';
        }, validationOptions),
      },
    },
    validationOptions,
  );
}

import { buildMessage, ValidateBy, ValidationOptions } from 'class-validator';

/**
 * Checks if the input is a Buffer.
 */
export function IsBuffer(validationOptions?: ValidationOptions) {
  return ValidateBy(
    {
      name: 'IsBuffer',
      validator: {
        validate: function (value, args) {
          return value instanceof Buffer;
        },
        defaultMessage: buildMessage(function (eachPrefix) {
          return eachPrefix + '$property is not a buffer instance.';
        }, validationOptions),
      },
    },
    validationOptions,
  );
}

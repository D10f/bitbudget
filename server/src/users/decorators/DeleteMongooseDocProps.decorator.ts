/**
 * Expects a list of properties that are to be removed from the method's
 * resulting MongoDB Document(s).
 */
export function DeleteMongooseDocProps(...properties: string[]) {
  return function (
    _target: any,
    _propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    const original = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const result = await original.apply(this, args);

      if (result instanceof Array) {
        result.forEach((resultItem) => {
          properties.forEach((prop) => delete resultItem[prop]);
        });
      } else {
        properties.forEach((prop) => delete result[prop]);
      }

      return result;
    };
  };
}

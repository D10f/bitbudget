/**
 * Turns an array of items into a generator function
 */
export function* makeGenerator<T> (list: T[]): Generator<T> {
  let item: T;
  for (item of list) {
    yield item;
  }
};
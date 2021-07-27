/**
* Creates a generator that produces items from the list array passed in
* @param  {array}    list An array or iterable object
* @return {function}      The generator function that will yield items from the list
*/
export default function* makeGenerator(list) {
  for (let i = 0; i < list.length; i++) {
    yield list[i];
  }
}

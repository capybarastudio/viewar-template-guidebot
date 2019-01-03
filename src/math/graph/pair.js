export default function createPair(first, second) {
  if (first === undefined || second === undefined)
    throw new Error('Both elements must be passed!');
  if (first === second) throw new Error('Elements must be distinct!');

  const internalArray = [first, second];

  const pair = Object.assign(internalArray, {
    getOther,
    replace,
    has: internalArray.includes.bind(internalArray),
  });

  return pair;

  function getOther(value) {
    const index = internalArray.indexOf(value);

    if (~index) {
      return internalArray[(index + 1) % internalArray.length];
    } else {
      return null;
    }
  }

  function replace(oldValue, newValue) {
    const oldValueIndex = internalArray.indexOf(oldValue);
    const newValueIndex = internalArray.indexOf(newValue);

    if (~oldValueIndex && !~newValueIndex) {
      internalArray[oldValueIndex] = newValue;
      return true;
    } else {
      return false;
    }
  }
}

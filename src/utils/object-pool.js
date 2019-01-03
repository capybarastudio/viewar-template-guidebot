export default function createObjectPool(factory, populationCount = 10) {
  const unused = new Array(populationCount).fill(null).map(() => factory());
  const used = [];

  function get() {
    if (unused.length === 0) {
      console.info('Object pool exhausted, populating...');
    }

    const object = unused.pop() || factory();
    used.push(object);
    return object;
  }

  function release() {
    while (used.length) {
      unused.push(used.pop());
    }
  }

  return {
    get,
    release,
    get usage() {
      return used.length;
    },
  };
}

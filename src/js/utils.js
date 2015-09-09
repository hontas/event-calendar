export function find(array, value, key) {
  let res = null;

  function getPredicate(item) {
    if (value instanceof RegExp) {
      return key ? value.test(item[key]) : value.test(item);
    }

    if (typeof value === 'function') {
      return key ? value(item[key]) : value(item);
    }

    return key ? item[key] === value : item === value;
  }

  array.some((item) => {
    const predicate = getPredicate(item);
    if (predicate) {
      res = item;
      return true;
    }
  });

  return res;
}

export function mapBy(array, keys) {
  if (Array.isArray(keys)) {
    return array.map((item) => {
      return keys.reduce((res, key) => {
        res[key] = item[key];
        return res;
      }, {});
    });
  }

  return array.map((item) => item[keys]);
}

export function capitalize(str) {
  if (typeof str !== 'string') {
    throw Error('Argument must be of type String');
  }
  return str.slice(0, 1).toUpperCase() + str.slice(1);
}

export function range(num) {
  let i = 0;
  const arr = [];
  do {
    arr.push(i);
  } while (++i < num);
  return arr;
}

export function isFunction(fn) {
  return typeof fn === 'function';
}

export default { find, mapBy, capitalize, range, isFunction };

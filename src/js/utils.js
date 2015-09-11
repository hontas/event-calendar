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
  if (!isString(str)) {
    throw Error('Argument must be of type String');
  }
  return str.slice(0, 1).toUpperCase() + str.slice(1);
}

export function range(num) {
  if (!isNumber(num)) {
    throw Error('Argument must be of type number');
  }

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

export function isString(str) {
  return typeof str === 'string';
}

export function isNumber(num) {
  return typeof num === 'number';
}

export function isUndefined(value) {
  return typeof value === 'undefined';
}

function zeroPad(num) {
  return num < 10 ? `0${num}` : `${num}`;
}

export function date(d) {
  let kronos;

  if (typeof d === 'object') {
    kronos = new Date(d.getTime());
  } else {
    kronos = d ? new Date(d) : new Date();
  }

  function getSet(value, key) {
    const hasValue = !isUndefined(value);
    const method = hasValue ? 'set' + key : 'get' + key;

    if (hasValue) {
      kronos[method](value);
      return api;
    }

    return kronos[method]();
  }

  const api = {
    valueOf() {
      return kronos.getTime();
    },

    getTime() {
      return kronos.getTime();
    },

    year() {
      return kronos.getFullYear();
    },

    month(value) {
      return getSet(value, 'Month');
    },

    date(value) {
      return getSet(value, 'Date');
    },

    weekday(value) {
      if (!isUndefined(value)) {
        const diff = value - api.weekday();

        api.date(api.date() + diff);
        return api;
      }

      return kronos.getDay();
    },

    time() {
      const hours = zeroPad(kronos.getHours());
      const minutes = zeroPad(kronos.getMinutes());
      return `${hours}:${minutes}`;
    },

    subtractMonth() {
      return api.month(kronos.getMonth() - 1);
    },

    addMonth() {
      return api.month(kronos.getMonth() + 1);
    },

    addDay() {
      return api.date(api.date() + 1);
    },

    isSameDay(timestamp) {
      const compareDate = new Date(timestamp);

      return ['getFullYear', 'getMonth', 'getDate'].every((fn) => {
        return compareDate[fn]() === kronos[fn]();
      });
    }
  };

  return api;
}

export default { find, mapBy, capitalize, range, isFunction, isString, isUndefined, date };

import test from 'tape';
import { range } from '../../src/js/utils';

test('range', (t) => {
  t.plan(1);
  t.deepEqual(range(5), [0, 1, 2, 3, 4], 'should return array from zero to num -1');
});

test('non numeric argument', (t) => {
  t.plan(2);

  function invoke(...args) {
    return function() {
      return range.apply(args);
    };
  }

  t.throws(invoke(), 'should throw');
  t.throws(invoke('12'), 'should throw');
});

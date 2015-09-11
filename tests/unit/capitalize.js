import test from 'tape';
import { capitalize } from '../../src/js/utils';

test('capitalize', (t) => {
  t.plan(1);
  t.equal(capitalize('hej min vän'), 'Hej min vän', 'should capitalize first letter');
});

test('no string supplied', (t) => {
  t.plan(1);

  function invoke() {
    return capitalize(42);
  }

  t.throws(invoke, '', 'should throw when invoked without string as argument');
});

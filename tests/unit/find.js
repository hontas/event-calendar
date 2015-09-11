import test from 'tape';
import { find } from '../../src/js/utils';

const arrayWithObjects = [
  { id: 1, name: 'Bill', sum: 13 },
  { id: 2, name: 'Pony', sum: 42 },
  { id: 3, name: 'Ally', sum: 76 }
];

const arrayWithValues = [
  'hello',
  true,
  false,
  {}
];

test('find', (t) => {
  t.plan(1);
  t.equal(typeof find, 'function', 'should be a function');
});

test('no match', (t) => {
  t.plan(2);
  t.equal(find(arrayWithValues, 'does not exist'), null, 'should return null');
  t.equal(find(arrayWithObjects, 'id', 12), null, 'should return null');
});

test('find by function', (t) => {
  t.plan(2);

  function comparator(value) {
    return value === 'hello' || value === 'Bill';
  }

  t.equal(find(arrayWithValues, comparator), 'hello', 'should return match');
  t.equal(find(arrayWithObjects, comparator, 'name'), arrayWithObjects[0], 'should return match');
});

test('find by regexp', (t) => {
  t.plan(2);

  const regexp = /ll[o|y]/;

  t.equal(find(arrayWithValues, regexp), 'hello', 'should return match');
  t.equal(find(arrayWithObjects, regexp, 'name'), arrayWithObjects[2], 'should return match');
});

test('find by comparison', (t) => {
  t.plan(2);
  t.equal(find(arrayWithValues, true), true, 'should return match');
  t.equal(find(arrayWithObjects, 42, 'sum'), arrayWithObjects[1], 'should return match');
});

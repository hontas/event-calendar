import test from 'tape';
import { mapBy } from '../../src/js/utils';

const testArray = [
  { name: 'Sven', age: 13, id: 234 },
  { name: 'Glen', age: 32, id: 434 },
  { name: 'Anna', age: 58, id: 834 }
];

test('mapBy', (t) => {
  t.plan(1);
  t.equal(typeof mapBy, 'function', 'should be a function');
});

test('map by key', (t) => {
  t.plan(1);
  t.deepEqual(mapBy(testArray, 'age'), [13, 32, 58], 'should return array with values');
});

test('map by array of keys', (t) => {
  t.plan(1);
  t.deepEqual(mapBy(testArray, ['name']), [
    { name: 'Sven' },
    { name: 'Glen' },
    { name: 'Anna' }
  ], 'should return objects with supplied keys');
});

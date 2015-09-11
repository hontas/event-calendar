import test from 'tape';
import eventCalendar from '../../src/js/calendar';

test('eventCalendar', (t) => {
  t.plan(1);
  t.equal(typeof eventCalendar, 'function', 'should be a function');
});

test('ctor', (t) => {
  t.plan(1);
  t.throws(eventCalendar, 'invalid', 'should throw');
});

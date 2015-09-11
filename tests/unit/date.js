import test from 'tape';
import { date } from '../../src/js/utils';

const datestring = '2015-04-27 09:00';
const timestamp = Date.parse(datestring);
const dateObj = new Date(datestring);
const now = Date.now();

function getDate() {
  return date(timestamp);
}

test('ctor', (t) => {
  t.plan(2);
  t.equal(typeof date, 'function', 'is a function');
  t.equal(typeof date(), 'object', 'is an object');
});

test('parse date', (t) => {
  t.plan(5);
  t.equal(date(now).getTime(), now, 'should be now');
  t.equal(date(timestamp).getTime(), timestamp, 'should parse timestamp');
  t.equal(date(datestring).getTime(), timestamp, 'should parse time string');
  t.equal(date(dateObj).getTime(), timestamp, 'should parse real date object');
  t.equal(date(date(now)).getTime(), now, 'should parse date object');
});

test('#valueOf, #getTime', (t) => {
  t.plan(3);
  const d = date();
  t.equal(typeof d.valueOf(), 'number', 'is a number');
  t.equal(typeof d.getTime(), 'number', 'is a number');
  t.equal(d.valueOf(), d.getTime(), 'is the same as getTime()');
});

test('#year', (t) => {
  t.plan(1);
  t.equal(getDate().year(), 2015, 'should get year');
});

test('#month', (t) => {
  t.plan(2);
  t.equal(getDate().month(), 3, 'should get month (zero index)');
  t.equal(getDate().month(5).month(), 5, 'should set month');
});

test('#date', (t) => {
  t.plan(2);
  t.equal(getDate().date(), 27, 'should get date');
  t.equal(getDate().date(15).date(), 15, 'should set date');
});

test('#weekday', (t) => {
  t.plan(2);
  t.equal(getDate().weekday(), 1, 'should get weekday (zero index)');
  t.equal(getDate().weekday(4).weekday(), 4, 'should set weekday');
});

test('#time', (t) => {
  t.plan(2);
  t.equal(typeof getDate().time(), 'string', 'should be string');
  t.equal(getDate().time(), '09:00', 'should get time');
});

test('#subtractMonth', (t) => {
  t.plan(1);
  t.equal(getDate().subtractMonth().month(), 2, 'should subtract one month');
});

test('#addMonth()', (t) => {
  t.plan(1);
  t.equal(getDate().addMonth().month(), 4, 'should add one month');
});

test('#addDay', (t) => {
  t.plan(1);
  t.equal(getDate().addDay().date(), 28, 'should add one day');
});

test('#isSameDay', (t) => {
  t.plan(2);
  t.ok(getDate().isSameDay(timestamp), 'should return true if it is the same day');
  t.notOk(getDate().isSameDay(now), 'should return false if it is NOT the same day');
});

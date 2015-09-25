import chai from 'chai';
import sinonChai from 'sinon-chai';
const expect = chai.expect;
chai.use(sinonChai);

import { date } from '../../src/js/utils';

const datestring = '2015-04-27 09:00';
const timestamp = Date.parse(datestring);
const dateObj = new Date(datestring);
const now = Date.now();

function getDate(time = timestamp) {
  return date(time);
}

describe('date', () => {
  describe('ctor', () => {
    it('should be a function that returns an object', () => {
      expect(date).to.be.a('function');
      expect(date()).to.be.an('object');
    });
  });

  describe('parse date', () => {
    it('should throw error on invaild date', () => {
      function invoke() {
        return date('sdfsdf');
      }
      expect(invoke).to.throw('Could not create date from \'sdfsdf\'');
    });

    it('should parse different date formats', () => {
      expect(date(now).getTime()).to.equal(now);
      expect(date(timestamp).getTime()).to.equal(timestamp);
      expect(date(datestring).getTime()).to.equal(timestamp);
      expect(date(dateObj).getTime()).to.equal(timestamp);
      expect(date(date(now)).getTime()).to.equal(now);
    });
  });

  describe('#valueOf, #getTime', () => {
    it('should return unix timestamp', () => {
      const d = date();
      expect(typeof d.valueOf()).to.equal('number');
      expect(typeof d.getTime()).to.equal('number');
      expect(d.valueOf()).to.equal(d.getTime());
    });
  });

  describe('#year', () => {
    it('should return current year', () => {
      expect(getDate().year()).to.be.a('number');
      expect(getDate().year()).to.equal(2015);
    });

    it('should set year', () => {
      const year = 1983;
      expect(getDate().year(year).year()).to.equal(year);
    });
  });

  describe('#month', () => {
    it('should return current month', () => {
      expect(getDate().month()).to.be.a('number');
      expect(getDate().month()).to.equal(3);
    });

    it('should set month', () => {
      const month = 5;
      expect(getDate().month(month).month()).to.equal(month);
    });
  });

  describe('#date', () => {
    it('should return current date', () => {
      expect(getDate().date()).to.be.a('number');
      expect(getDate().date()).to.equal(27);
    });

    it('should should set date', () => {
      const newDate = 15;
      expect(getDate().date(newDate).date()).to.equal(newDate);
    });
  });

  describe('#weekday', () => {
    it('should return current weekday number', () => {
      expect(getDate().weekday()).to.be.a('number');
      expect(getDate().weekday()).to.equal(1);
    });

    it('should set weekday', () => {
      const weekday = 4;
      expect(getDate().weekday(weekday).weekday()).to.equal(weekday);
    });
  });

  describe('#time', () => {
    it('should return current time in 24h format', () => {
      expect(typeof getDate().time()).to.equal('string');
      expect(getDate().time()).to.equal('09:00');
    });

    it('should return current time in 12h format', () => {
      expect(getDate().time(true)).to.equal('9:00am');
      expect(getDate('2015-09-14 15:20').time(true)).to.equal('3:20pm');
    });
  });

  describe('#subtractMonth', () => {
    it('should subtract one month', () => {
      expect(getDate().subtractMonth().month()).to.equal(2);
    });
  });

  describe('#addMonth()', () => {
    it('should add one month', () => {
      expect(getDate().addMonth().month()).to.equal(4);
    });
  });

  describe('#addDay', () => {
    it('should add one day', () => {
      expect(getDate().addDay().date()).to.equal(28);
    });
  });

  describe('#isSameDay', () => {
    it('should return true if same day', () => {
      expect(getDate().isSameDay(timestamp)).to.be.true;
    });

    it('should return false if NOT same day', () => {
      expect(getDate().isSameDay(now)).to.be.false;
    });
  });
});

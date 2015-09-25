import chai from 'chai';
import sinonChai from 'sinon-chai';
const expect = chai.expect;
chai.use(sinonChai);

import eventCalendar from '../../src/js/calendar';

describe('eventCalendar', () => {
  it('should be a function', () => {
    expect(eventCalendar).to.be.a('function');
  });

  describe('ctor', () => {
    it('ctor', () => {
      expect(eventCalendar).to.throw();
    });
  });
});

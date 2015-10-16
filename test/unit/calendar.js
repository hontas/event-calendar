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
    it('should throw when invoked without arguments', () => {
      expect(eventCalendar).to.throw();
    });

    it('should expose property version', () => {
      expect(eventCalendar).to.have.property('version').that.match(/\d\.\d+\.\d+/);
    });
  });
});

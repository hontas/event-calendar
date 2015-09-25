import chai from 'chai';
import sinonChai from 'sinon-chai';
const expect = chai.expect;
chai.use(sinonChai);

import { range } from '../../src/js/utils';

describe('range', () => {
  it('should return array from zero to num-1', () => {
    expect(range(5)).to.eql([0, 1, 2, 3, 4]);
  });

  context('non numeric argument', () => {
    function invoke(value) {
      return function() {
        return range(value);
      };
    }

    const exception = 'Argument must be of type number';

    it('should throw when not invoked with a number', () => {
      expect(invoke()).to.throw(exception);
      expect(invoke('12')).to.throw(exception);
      expect(invoke({})).to.throw(exception);
      expect(invoke([])).to.throw(exception);
      expect(invoke(null)).to.throw(exception);
      expect(invoke(NaN)).to.throw(exception);
    });
  });
});

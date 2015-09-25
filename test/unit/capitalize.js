import chai from 'chai';
import sinonChai from 'sinon-chai';
const expect = chai.expect;
chai.use(sinonChai);

import { capitalize } from '../../src/js/utils';

describe('capitalize', () => {
  it('Should capitalize supplied string', ()=> {
    expect(capitalize('')).to.equal('');
    expect(capitalize('hej min vän')).to.equal('Hej min vän');
  });

  it('no string supplied', () => {
    function invoke(value) {
      return function() {
        return capitalize(value);
      };
    }

    const exception = 'Argument must be of type String';

    expect(invoke()).to.throw(exception);
    expect(invoke(42)).to.throw(exception);
    expect(invoke({})).to.throw(exception);
    expect(invoke([])).to.throw(exception);
    expect(invoke(null)).to.throw(exception);
    expect(invoke(NaN)).to.throw(exception);
  });
});

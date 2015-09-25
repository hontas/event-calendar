import chai from 'chai';
import sinonChai from 'sinon-chai';
const expect = chai.expect;
chai.use(sinonChai);

import { isNaN } from '../../src/js/utils';

describe('isNaN', () => {
  it('should return true when passed NaN', () => {
    expect(isNaN(NaN)).to.be.true;
  });

  it('should return false for everything else', () => {
    expect(isNaN(0)).to.be.false;
    expect(isNaN(-1)).to.be.false;
    expect(isNaN(1 / 0)).to.be.false;
    expect(isNaN('')).to.be.false;
    expect(isNaN('0')).to.be.false;
    expect(isNaN([])).to.be.false;
    expect(isNaN({})).to.be.false;
  });
});

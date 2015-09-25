import chai from 'chai';
import sinonChai from 'sinon-chai';
const expect = chai.expect;
chai.use(sinonChai);

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

describe('find', () => {
  describe('ctor', () => {
    expect(find).to.be.a('function');
  });

  context('no match', () => {
    it('should return null', () => {
      expect(find(arrayWithValues, 'does not exist')).to.be.null;
      expect(find(arrayWithObjects, 'id', 12)).to.be.null;
    });
  });

  context('find by function', () => {
    function comparator(value) {
      return value === 'hello' || value === 'Bill';
    }

    it('should return match', () => {
      expect(find(arrayWithValues, comparator)).to.equal('hello');
      expect(find(arrayWithObjects, comparator, 'name')).to.equal(arrayWithObjects[0]);
    });
  });

  context('find by regexp', () => {
    const regexp = /ll[o|y]/;

    it('should return match', () => {
      expect(find(arrayWithValues, regexp)).to.equal('hello');
      expect(find(arrayWithObjects, regexp, 'name')).to.equal(arrayWithObjects[2]);
    });
  });

  context('find by value', () => {
    it('should return match', () => {
      expect(find(arrayWithValues, true)).to.equal(true);
      expect(find(arrayWithObjects, 42, 'sum')).to.equal(arrayWithObjects[1]);
    });
  });
});


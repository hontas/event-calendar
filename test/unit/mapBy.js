import chai from 'chai';
import sinonChai from 'sinon-chai';
const expect = chai.expect;
chai.use(sinonChai);

import { mapBy } from '../../src/js/utils';

const describeArray = [
  { name: 'Sven', age: 13, id: 234 },
  { name: 'Glen', age: 32, id: 434 },
  { name: 'Anna', age: 58, id: 834 }
];

describe('mapBy', () => {
  it('should be a function', () => {
    expect(mapBy).to.be.a('function');
  });

  describe('map by key', () => {
    it('should return array of values', () => {
      expect(mapBy(describeArray, 'age')).to.eql([13, 32, 58]);
    });
  });

  describe('map by array of keys', () => {
    it('should return objects with supplied keys', () => {
      expect(mapBy(describeArray, ['name'])).to.eql([
        { name: 'Sven' },
        { name: 'Glen' },
        { name: 'Anna' }
      ]);
    });
  });
});

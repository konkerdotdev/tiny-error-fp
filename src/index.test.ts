import * as unit from './index';

describe('TinyError', () => {
  describe('toTinyError', () => {
    it('should work as expected with an Error instance input', () => {
      const error = new Error('BOOM!');
      const actual = unit.toTinyError('MY_TAG')(error);
      const expected = { message: 'BOOM!', cause: error, _tag: 'MY_TAG' };
      expect(actual).toStrictEqual(expected);
    });

    it('should work as expected with a non-Error input', () => {
      const error = 'BOOM!';
      const actual = unit.toTinyError('MY_TAG')(error);
      const expected = { message: 'BOOM!', cause: error, _tag: 'MY_TAG' };
      expect(actual).toStrictEqual(expected);
    });
  });
});

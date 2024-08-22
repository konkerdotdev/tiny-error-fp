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

  describe('isTinyError', () => {
    it('should work as expected with a matching TinyError instance input', () => {
      expect(unit.isTinyError('TEST_TAG')(unit.toTinyError('TEST_TAG')('Boom!'))).toEqual(true);
    });

    it('should work as expected with a non-matching TinyError instance input', () => {
      expect(unit.isTinyError('TEST_TAG')(unit.toTinyError('OTHER_TAG')('Boom!'))).toEqual(false);
    });

    it('should work as expected with an Error instance input', () => {
      expect(unit.isTinyError('TEST_TAG')(new Error('Boom!'))).toEqual(false);
    });

    it('should work as expected with some other input', () => {
      expect(unit.isTinyError('TEST_TAG')('Boom!')).toEqual(false);
    });
  });

  describe('hasErrorMessage', () => {
    it('should work as expected with an object', () => {
      expect(unit.hasErrorMessage({ message: 'Boom!' })).toEqual(true);
      expect(unit.hasErrorMessage({ baggage: 'Boom!' })).toEqual(false);
    });

    it('should work as expected with an Error instance', () => {
      expect(unit.hasErrorMessage(new Error('Boom!'))).toEqual(true);
    });
  });

  describe('toError', () => {
    it('should function as expected', () => {
      const someError = new Error('SOME_ERROR');

      expect(unit.toError('BANANA')).toStrictEqual(new Error('BANANA'));
      expect(unit.toError({ foo: 'BAR' })).toStrictEqual(new Error('[object Object]'));
      expect(unit.toError(someError)).toStrictEqual(someError);
    });
  });
});

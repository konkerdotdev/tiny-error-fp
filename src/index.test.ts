import * as unit from './index';

describe('TinyError', () => {
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

  describe('toTinyError', () => {
    it('should work as expected with an TinyError instance input', () => {
      const error = unit.TinyError('MyTag')('BOOM!');
      const actual = unit.toTinyError('MyTag')(error);
      expect(actual.toObject()).toStrictEqual(error.toObject());
    });

    it('should work as expected with a Error instance input', () => {
      const error = new Error('BOOM!');
      const actual = unit.toTinyError('MyTag')(error);
      expect(actual.toObject()).toStrictEqual({
        _tag: 'MyTag',
        cause: error,
        codeTag: 'GENERAL',
        internal: true,
        message: 'BOOM!',
        name: 'Error',
        statusCode: -1,
        stack: expect.any(String),
      });
    });

    it('should work as expected with a non-Error input with message', () => {
      const error = { message: 'BOOM!' };
      const actual = unit.toTinyError('MyTag')(error);
      expect(actual.toObject()).toStrictEqual({
        _tag: 'MyTag',
        cause: {
          message: 'BOOM!',
        },
        codeTag: 'GENERAL',
        internal: true,
        message: 'BOOM!',
        name: 'MyTag',
        statusCode: -1,
        stack: expect.any(String),
      });
    });

    it('should work as expected with a non-Error input without message', () => {
      const error = { baggage: 'BOOM!' };
      const actual = unit.toTinyError('MyTag')(error);
      expect(actual.toObject()).toStrictEqual({
        _tag: 'MyTag',
        cause: {
          baggage: 'BOOM!',
        },
        codeTag: 'GENERAL',
        internal: true,
        message: '{"baggage":"BOOM!"}',
        name: 'MyTag',
        statusCode: -1,
        stack: expect.any(String),
      });
    });

    it('should work as expected with a string input', () => {
      const error = 'BOOM!';
      const actual = unit.toTinyError('MyTag')(error);
      expect(actual.toObject()).toStrictEqual({
        _tag: 'MyTag',
        cause: 'BOOM!',
        codeTag: 'GENERAL',
        internal: true,
        message: 'BOOM!',
        name: 'MyTag',
        statusCode: -1,
        stack: expect.any(String),
      });
    });
  });
});

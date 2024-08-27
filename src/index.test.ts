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
    it('should work as expected with a TinyError instance input', () => {
      const error = new Error('BOOM!');
      const actual = unit.toTinyError('MyTag')(error);
      expect(JSON.stringify(actual)).toStrictEqual(
        JSON.stringify({
          _tag: 'MyTag',
          statusCode: -1,
          codeTag: 'GENERAL',
          internal: true,
          name: 'Error',
          message: 'BOOM!',
          cause: {},
        })
      );
    });

    it('should work as expected with an Error instance input', () => {
      const error = unit.TinyError('MyTag')('BOOM!');
      const actual = unit.toTinyError('MyTag')(error);
      expect(JSON.stringify(actual)).toStrictEqual(
        JSON.stringify({
          _tag: 'MyTag',
          statusCode: -1,
          codeTag: 'GENERAL',
          internal: true,
          name: 'BOOM!',
          message: 'MyTag',
          cause: 'UNKNOWN',
        })
      );
    });

    it('should work as expected with a non-Error input with message', () => {
      const error = { baggage: 'BOOM!' };
      const actual = unit.toTinyError('MyTag')(error);
      expect(JSON.stringify(actual)).toStrictEqual(
        JSON.stringify({
          _tag: 'MyTag',
          statusCode: -1,
          codeTag: 'GENERAL',
          internal: true,
          name: 'MyTag',
          message: '{"baggage":"BOOM!"}',
          cause: { baggage: 'BOOM!' },
        })
      );
    });

    it('should work as expected with a non-Error input with message', () => {
      const error = { message: 'BOOM!' };
      const actual = unit.toTinyError('MyTag')(error);
      expect(JSON.stringify(actual)).toStrictEqual(
        JSON.stringify({
          _tag: 'MyTag',
          statusCode: -1,
          codeTag: 'GENERAL',
          internal: true,
          name: 'MyTag',
          message: 'BOOM!',
          cause: { message: 'BOOM!' },
        })
      );
    });

    it('should work as expected with a string input', () => {
      const error = 'BOOM!';
      const actual = unit.toTinyError('MyTag')(error);
      expect(JSON.stringify(actual)).toStrictEqual(
        JSON.stringify({
          _tag: 'MyTag',
          statusCode: -1,
          codeTag: 'GENERAL',
          internal: true,
          name: 'MyTag',
          message: 'BOOM!',
          cause: 'BOOM!',
        })
      );
    });
  });
});

/* eslint-disable fp/no-class,fp/no-unused-expression,fp/no-mutation,fp/no-this,fp/no-nil */
import * as P from '@konker.dev/effect-ts-prelude';

import {
  TINY_ERROR_DEFAULT_CODE_TAG,
  TINY_ERROR_DEFAULT_INTERNAL,
  TINY_ERROR_DEFAULT_STATUS_CODE,
  TINY_ERROR_UNKNOWN_STRING,
} from './consts';
import { hasErrorMessage, hasTag, isError } from './lib';

// --------------------------------------------------------------------------
export type TinyError<T extends string> = Error & {
  readonly _tag: T;

  readonly name: string; // From Error
  readonly message: string; // From Error
  readonly stack?: string; // From Error

  readonly statusCode: number;
  readonly codeTag: string;
  readonly cause?: unknown;
  readonly internal: boolean;
};

// --------------------------------------------------------------------------
export class TinyErrorC<T extends string> extends Error {
  readonly _tag: T;
  readonly statusCode: number;
  readonly codeTag: string;
  readonly internal: boolean;

  constructor(
    tag: T,
    name?: string,
    message?: string,
    statusCode?: number,
    codeTag?: string,
    cause?: unknown,
    internal?: boolean,
    stack?: string
  ) {
    super();

    this._tag = tag;
    this.name = name ?? tag;
    this.message = message ?? tag;
    this.codeTag = codeTag ?? TINY_ERROR_DEFAULT_CODE_TAG;
    this.statusCode = statusCode ?? TINY_ERROR_DEFAULT_STATUS_CODE;
    this.cause = cause ?? TINY_ERROR_UNKNOWN_STRING();
    this.internal = internal ?? TINY_ERROR_DEFAULT_INTERNAL;
    this.stack = stack ?? super.stack!;
  }
}

// --------------------------------------------------------------------------
export const TinyError =
  <T extends string>(tag: T) =>
  (
    name?: string,
    message?: string,
    statusCode?: number,
    codeTag?: string,
    cause?: unknown,
    internal?: boolean,
    stack?: string
  ): TinyError<T> => {
    return new TinyErrorC(tag, name, message, statusCode, codeTag, cause, internal, stack);
  };

// --------------------------------------------------------------------------
export const isTinyError =
  <T extends string>(tag: T) =>
  (x: unknown): x is TinyError<T> =>
    hasTag(tag)(x) && isError(x);

// --------------------------------------------------------------------------
export const toTinyError =
  <T extends string>(tag: T) =>
  (
    x: unknown,
    name?: string,
    message?: string,
    statusCode?: number,
    codeTag?: string,
    cause?: unknown,
    internal?: boolean
  ): TinyError<T> => {
    if (isTinyError(tag)(x)) return x;
    if (isError(x)) {
      return TinyError(tag)(name ?? x.name, message ?? x.message, statusCode, codeTag, cause ?? x, internal, x.stack);
    }
    if (hasErrorMessage(x)) {
      return TinyError(tag)(name, message ?? x.message, statusCode, codeTag, cause ?? x, internal);
    }
    if (typeof x === 'string') {
      return TinyError(tag)(name, message ?? x, statusCode, codeTag, cause ?? x, internal);
    }
    return TinyError(tag)(
      name,
      message ??
        P.pipe(
          x,
          P.Schema.encodeEither(P.Schema.parseJson()),
          P.Either.match({ onLeft: TINY_ERROR_UNKNOWN_STRING, onRight: P.identity })
        ),
      statusCode,
      codeTag,
      cause ?? x,
      internal
    );
  };

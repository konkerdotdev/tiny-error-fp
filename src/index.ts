export type TinyError<T extends string> = {
  readonly _tag: T;
  readonly message: string;
  readonly cause: unknown;
};

export const toTinyError =
  <T extends string>(tag: T) =>
  (x: unknown): TinyError<T> => {
    return {
      _tag: tag,
      message: typeof x === 'object' && x && 'message' in x && typeof x.message === 'string' ? x.message : String(x),
      cause: x,
    };
  };

export const isTinyError =
  <T extends string>(tag: T) =>
  (x: unknown): x is TinyError<T> =>
    // Check that has matching _tag and a message
    !!x && typeof x === 'object' && '_tag' in x && x._tag === tag && 'message' in x && typeof x.message === 'string';

// --------------------------------------------------------------------------
export function hasErrorMessage(x: unknown): boolean {
  return typeof x === 'object' && !!x && 'message' in x && typeof x.message === 'string';
}

export function toError(x: unknown): Error {
  return x instanceof Error ? x : new Error(String(x));
}

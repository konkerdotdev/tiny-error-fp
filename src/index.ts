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

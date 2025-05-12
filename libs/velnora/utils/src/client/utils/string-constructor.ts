import type { ExtendFn, ExtendableFn, ExtensionFn, Prettify, RawString, ToString } from "@velnora/types";

export const stringConstructor = <
  TBaseKey extends string,
  TExtension extends object,
  TDelimiter extends string,
  TConstructorExtensions extends Record<string, ExtendableFn>
>(
  baseKey: TBaseKey,
  delimiter: TDelimiter,
  extension: (cb: ExtensionFn<TBaseKey, TDelimiter, TConstructorExtensions>) => TExtension = () => ({}) as TExtension,
  stringConstructorExtensions?: TConstructorExtensions,
  cb: (baseString: string, ...strings: string[]) => string = (baseString: string, ...strings: string[]) =>
    [baseString, ...strings].join(delimiter)
): Prettify<
  RawString<TBaseKey> &
    ToString<TBaseKey> & { [key in keyof TConstructorExtensions]: ReturnType<TConstructorExtensions[key]> } & TExtension
> => {
  const efn = (<TKeys extends readonly string[]>(...keys: TKeys) => cb(baseKey, ...keys)) as ExtensionFn<
    TBaseKey,
    TDelimiter,
    TConstructorExtensions
  >;
  efn.e = (...keysWithExtension) => {
    const keys = keysWithExtension.slice(0, -1) as unknown as string[];
    let newExtension = keysWithExtension.at(-1)! as unknown as any;
    if (typeof newExtension !== "function") {
      keys.push(newExtension);
      newExtension = undefined;
    }
    return stringConstructor(efn(...keys), delimiter, newExtension, stringConstructorExtensions, cb);
  };

  efn.f =
    () =>
    extensionFn =>
    (...args) =>
      efn.e(...args, extensionFn);

  let sceReturnResult = {} as { [TKey in keyof TConstructorExtensions]: ReturnType<TConstructorExtensions[TKey]> };
  if (stringConstructorExtensions) {
    const sceEntries = Object.entries(stringConstructorExtensions);
    const updatedSce = sceEntries.map(
      ([key, fn]) =>
        [
          key,
          (...keys) => {
            const constructorResult = efn.e(...keys);
            const fnResult = fn(constructorResult.$raw);
            return Object.assign({}, fnResult, constructorResult);
          }
        ] as [typeof key, ExtendFn<TBaseKey, TDelimiter, TConstructorExtensions>]
    );
    const sce = Object.fromEntries(updatedSce);
    Object.assign(efn, sce);
  }

  return Object.assign<
    RawString<TBaseKey>,
    { [key in keyof TConstructorExtensions]: ReturnType<TConstructorExtensions[key]> },
    TExtension
  >({ $raw: baseKey, toString: () => baseKey }, sceReturnResult, extension(efn));
};

stringConstructor.new = <TDelimiter extends string, TConstructorExtensions extends Record<string, ExtendableFn>>(
  delimiter: TDelimiter,
  stringConstructorExtensions?: TConstructorExtensions,
  cb?: (baseString: string, ...strings: string[]) => string
) =>
  Object.assign(
    <TBaseKey extends string, TExtension extends object>(
      baseKey: TBaseKey,
      extension: (cb: ExtensionFn<TBaseKey, TDelimiter, TConstructorExtensions>) => TExtension
    ) => stringConstructor(baseKey, delimiter, extension, stringConstructorExtensions, cb),
    {
      new<TNewConstructorExtensions extends Record<string, ExtendableFn>>(
        moreExtensions?: TNewConstructorExtensions,
        newCb?: (baseString: string, ...strings: string[]) => string
      ) {
        return stringConstructor.new(
          delimiter,
          { ...stringConstructorExtensions, ...moreExtensions } as TConstructorExtensions & TNewConstructorExtensions,
          (baseString, ...strings) =>
            newCb?.(cb?.(baseString, ...strings) || baseString, ...strings) ||
            cb?.(baseString, ...strings) ||
            baseString
        );
      }
    }
  );

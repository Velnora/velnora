import type { MergeStrings } from "./merge-strings";
import type { Prettify } from "./prettify";
import type { ToString } from "./to-string";

export type ExtendableFn<TExtension = unknown> = (key: string) => TExtension;

export interface RawString<T extends string> extends ToString<T> {
  readonly $raw: T;
}

export type WithStringConstructor<TObject = {}> = RawString<string> & TObject;

export type ExtendFnReturnType<
  TKey extends string,
  TKeys extends readonly string[],
  TDelimiter extends string,
  TExtension extends object,
  TExtraReturn = {}
> = Prettify<RawString<MergeStrings<[TKey, ...TKeys], TDelimiter>> & TExtension & TExtraReturn>;

export type ExtendFn<
  TKey extends string,
  TDelimiter extends string,
  TConstructorExtensions extends Record<string, ExtendableFn>,
  TExtraReturn = {}
> = <TKeys extends string[], TExtension extends object>(
  ...keysWithExtensionFn:
    | TKeys
    | [
        ...TKeys,
        ((
          cb: ExtensionFn<MergeStrings<[TKey, ...TKeys], TDelimiter>, TDelimiter, TConstructorExtensions>
        ) => TExtension)?
      ]
) => Prettify<ExtendFnReturnType<TKey, TKeys, TDelimiter, TExtension, TExtraReturn>>;

type UpdateExtensions<
  TKey extends string,
  TDelimiter extends string,
  TConstructorExtensions extends Record<string, ExtendableFn>
> = {
  [K in keyof TConstructorExtensions]: ExtendFn<
    TKey,
    TDelimiter,
    TConstructorExtensions,
    ReturnType<TConstructorExtensions[K]>
  >;
};

export type ExtensionFn<
  TKey extends string,
  TDelimiter extends string,
  TConstructorExtensions extends Record<string, ExtendableFn>
> = {
  <TKeys extends readonly string[]>(...paths: TKeys): MergeStrings<[TKey, ...TKeys], TDelimiter>;

  e: ExtendFn<TKey, TDelimiter, TConstructorExtensions>;
  f<TArgs extends readonly string[]>(): <TExtension extends object>(
    efn: (cb: ExtensionFn<MergeStrings<[TKey, ...TArgs], TDelimiter>, TDelimiter, TConstructorExtensions>) => TExtension
  ) => (...args: TArgs) => ExtendFnReturnType<TKey, TArgs, TDelimiter, TExtension>;
} & UpdateExtensions<TKey, TDelimiter, TConstructorExtensions>;

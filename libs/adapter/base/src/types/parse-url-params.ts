import type { ParseUrlParamName } from "./parse-url-param-name";

export type ParseUrlParams<TPath extends string | RegExp> = TPath extends string
  ? Record<TPath extends "*" ? string : ParseUrlParamName<TPath>, string>
  : TPath extends RegExp
    ? Record<string, string>
    : never;

import type { ColorFn } from "./color-fn";

export interface ColorScheme {
  null: ColorFn;
  undefined: ColorFn;
  boolean: ColorFn;
  number: ColorFn;
  bigint: ColorFn;
  string: ColorFn;
  symbol: ColorFn;
  function: ColorFn;
  date: ColorFn;
  regexp: ColorFn;
  key: ColorFn;
  colon: ColorFn;
  brace: ColorFn;
  comma: ColorFn;
  mapArrow: ColorFn;
  circular: ColorFn;
}

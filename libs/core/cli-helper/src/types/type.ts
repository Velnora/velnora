import type { LiteralType } from "./literal-type";

export interface Type<TType extends LiteralType = LiteralType, TValues extends string = string> {
  type: TType;
  values: TValues;
}

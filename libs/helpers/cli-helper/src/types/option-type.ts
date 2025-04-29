import type { InferType } from "./infer-type";
import type { LiteralType } from "./literal-type";

export interface OptionType<TType extends LiteralType, TAlias extends string = string> {
  type: TType;
  alias?: TAlias;
  description?: string;
  default?: InferType<TType> | null;
}

export interface PositionalOption<TAlias extends string = string> extends OptionType<"string", TAlias> {
  required?: boolean;
}

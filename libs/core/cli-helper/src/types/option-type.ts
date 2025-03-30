import type { InferType } from "./infer-type";
import type { LiteralType } from "./literal-type";

export interface OptionType<TType extends LiteralType, TAlias extends string = string> {
  type: TType;
  alias?: TAlias;
  description?: string;
  defaultValue?: InferType<TType> | null;
}

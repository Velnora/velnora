import type { InferType } from "../infer-type";
import type { LiteralType } from "../literal-type";

export interface BaseOption<TType extends LiteralType, TAlias extends string = string> {
  type: TType;
  alias?: TAlias;
  description?: string;
  default?: InferType<TType> | null;
}

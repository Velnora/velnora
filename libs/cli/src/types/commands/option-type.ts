import type { InferType } from "../infer/infer-type";
import type { LiteralType } from "./literal-type";

export type OptionType<TType extends LiteralType, TAlias extends string = string> = {
  type: TType;
  alias?: TAlias;
  description?: string;
  defaultValue?: InferType<TType> | null;
};

import type { LiteralUnion } from "type-fest";

import type { InferType } from "../infer-type";
import type { LiteralType } from "../literal-type";

export interface BaseOption<TType extends LiteralType, TAlias extends string, TDependsOn> {
  type: TType;
  alias?: TAlias;
  description?: string;
  default?: InferType<TType> | null;
  requires?: LiteralUnion<TDependsOn, string> | LiteralUnion<TDependsOn, string>[];
}

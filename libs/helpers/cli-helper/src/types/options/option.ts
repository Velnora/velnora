import type { LiteralType } from "../literal-type";
import type { BaseOption } from "./base-option";

export interface Option<TType extends LiteralType, TAlias extends string, TDependsOn>
  extends BaseOption<TType, TAlias, TDependsOn> {}

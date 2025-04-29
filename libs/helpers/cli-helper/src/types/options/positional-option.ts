import type { BaseOption } from "./base-option";

export interface PositionalOption<TAlias extends string = string> extends Omit<BaseOption<"string", TAlias>, "type"> {
  required?: boolean;
}

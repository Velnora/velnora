import type { LiteralType } from "../commands/literal-type";

export type InferType<T extends LiteralType> = T extends "string"
  ? string
  : T extends "number"
    ? number
    : T extends "boolean"
      ? boolean
      : never;

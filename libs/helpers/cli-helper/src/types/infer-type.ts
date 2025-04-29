import type { LiteralType } from "./literal-type";

export type InferType<TType extends LiteralType, TUnionType = any> = TType extends "string"
  ? string
  : TType extends "number"
    ? number
    : TType extends "boolean"
      ? boolean
      : TType extends "union"
        ? TUnionType
        : never;

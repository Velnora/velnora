import type { LiteralType } from "../literal-type";

export type InferType<T extends LiteralType, TUnionType = any> = T extends "string"
  ? string
  : T extends "number"
    ? number
    : T extends "boolean"
      ? boolean
      : T extends "union"
        ? TUnionType
        : never;

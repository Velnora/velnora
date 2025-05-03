import type { PartialDeep } from "type-fest";

export type JsonMergeInput<T> = PartialDeep<T> | ((current: T) => T | void);
export const isMergeCallback = <T>(value: JsonMergeInput<T>): value is (current: T) => T | void =>
  typeof value === "function";

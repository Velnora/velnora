import type { ExtractParams } from "./extract-params";

export type ExtractParamsObject<TPath extends string> = {
  [TKey in ExtractParams<TPath>]: string;
};

import type { SliceArguments } from "./slice-arguments";
import type { TupleLengthConstraint } from "./tuple-length-constraint";

export type OmitParams<TObject, TParams extends readonly string[]> = {
  [K in keyof TObject]: TObject[K] extends (...args: infer Args) => infer R
    ? (...args: SliceArguments<Args, TParams extends { length: TupleLengthConstraint } ? TParams["length"] : 0>) => R
    : TObject[K];
};

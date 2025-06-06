import type { DecrementMap } from "./decrement-map";
import type { TupleLengthConstraint } from "./tuple-length-constraint";

export type SliceArguments<Args extends readonly any[], N extends TupleLengthConstraint> = N extends 0
  ? Args
  : Args extends [any, ...infer Rest]
    ? SliceArguments<Rest, DecrementMap[N]>
    : [];

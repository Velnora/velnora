import type { ValueKind } from "./value-kind";

export type PositionKind = Exclude<ValueKind, "enum">;

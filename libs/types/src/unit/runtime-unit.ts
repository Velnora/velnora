import type { BaseUnit } from "./base-unit";
import type { Toolchain } from "./runtime";
import type { UnitKind } from "./unit-kind";

export interface RuntimeUnit<
  TRequiredUnits extends readonly string[] = readonly string[],
  TOptionalUnits extends readonly string[] = readonly string[]
>
  extends BaseUnit<TRequiredUnits, TOptionalUnits>, Toolchain {
  kind: UnitKind.RUNTIME;
}

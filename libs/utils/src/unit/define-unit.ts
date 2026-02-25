import type { UnitKind, VelnoraUnit } from "@velnora/types";
import { type ConfigEnv } from "@velnora/types";

export const defineUnit = <TUnit extends VelnoraUnit>(
  kind: UnitKind,
  unit: Omit<TUnit, "kind"> | ((env: ConfigEnv) => Omit<TUnit, "kind">)
): TUnit | ((env: ConfigEnv) => TUnit) => {
  if (typeof unit === "function") {
    return (env: ConfigEnv): TUnit => {
      const unitDef = unit(env);
      return { ...unitDef, kind } as TUnit;
    };
  }
  return { ...unit, kind } as TUnit;
};

import type { Unit, UnitKind } from "@velnora/types";
import { type ConfigEnv } from "@velnora/types";

export const defineUnit = <TUnitKind extends UnitKind>(kind: TUnitKind) => {
  return <
    const TRequiredUnits extends readonly (keyof Velnora.UnitRegistry)[] = readonly (keyof Velnora.UnitRegistry)[],
    const TOptionalUnits extends readonly (keyof Velnora.UnitRegistry)[] = readonly (keyof Velnora.UnitRegistry)[]
  >(
    unit:
      | ((env: ConfigEnv) => Omit<Unit<TUnitKind, TRequiredUnits, TOptionalUnits>, "kind">)
      | Omit<Unit<TUnitKind, TRequiredUnits, TOptionalUnits>, "kind">
  ) => {
    if (typeof unit === "function") {
      return (env: ConfigEnv): Unit<TUnitKind, TRequiredUnits, TOptionalUnits> => {
        const unitDef = unit(env);
        return { ...unitDef, kind } as Unit<TUnitKind, TRequiredUnits, TOptionalUnits>;
      };
    }
    return { ...unit, kind } as Unit<TUnitKind, TRequiredUnits, TOptionalUnits>;
  };
};

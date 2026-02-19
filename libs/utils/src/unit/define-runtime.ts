import type { ConfigEnv } from "@velnora/types";
import { type RuntimeUnit, UnitKind } from "@velnora/types";

export const defineRuntime = <
  TRequiredUnits extends readonly string[] = readonly string[],
  TOptionalUnits extends readonly string[] = readonly string[]
>(
  unit:
    | ((env: ConfigEnv) => Omit<RuntimeUnit<TRequiredUnits, TOptionalUnits>, "kind">)
    | Omit<RuntimeUnit<TRequiredUnits, TOptionalUnits>, "kind">
) => {
  if (typeof unit === "function") {
    return (env: ConfigEnv): RuntimeUnit<TRequiredUnits, TOptionalUnits> => {
      const unitDef = unit(env);
      return { ...unitDef, kind: UnitKind.RUNTIME };
    };
  }
  return { ...unit, kind: UnitKind.RUNTIME };
};

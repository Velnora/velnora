import { type AdapterUnit, type ConfigEnv, UnitKind } from "@velnora/types";

import { defineUnit } from "./define-unit";

export function defineAdapter<
  TRequiredUnits extends readonly (keyof Velnora.UnitRegistry)[] = readonly (keyof Velnora.UnitRegistry)[],
  TOptionalUnits extends readonly (keyof Velnora.UnitRegistry)[] = readonly (keyof Velnora.UnitRegistry)[]
>(unit: Omit<AdapterUnit<TRequiredUnits, TOptionalUnits>, "kind">): AdapterUnit<TRequiredUnits, TOptionalUnits>;

export function defineAdapter<
  TRequiredUnits extends readonly (keyof Velnora.UnitRegistry)[] = readonly (keyof Velnora.UnitRegistry)[],
  TOptionalUnits extends readonly (keyof Velnora.UnitRegistry)[] = readonly (keyof Velnora.UnitRegistry)[]
>(
  unit: (env: ConfigEnv) => Omit<AdapterUnit<TRequiredUnits, TOptionalUnits>, "kind">
): (env: ConfigEnv) => AdapterUnit<TRequiredUnits, TOptionalUnits>;

/**
 *
 */
export function defineAdapter<
  TRequiredUnits extends readonly (keyof Velnora.UnitRegistry)[] = readonly (keyof Velnora.UnitRegistry)[],
  TOptionalUnits extends readonly (keyof Velnora.UnitRegistry)[] = readonly (keyof Velnora.UnitRegistry)[]
>(
  unit:
    | Omit<AdapterUnit<TRequiredUnits, TOptionalUnits>, "kind">
    | ((env: ConfigEnv) => Omit<AdapterUnit<TRequiredUnits, TOptionalUnits>, "kind">)
) {
  return defineUnit<AdapterUnit<TRequiredUnits, TOptionalUnits>>(UnitKind.ADAPTER, unit);
}

import type { BaseUnit } from "./base-unit";

export interface AdapterUnit<
  TRequiredUnits extends readonly (keyof Velnora.UnitRegistry)[] = readonly (keyof Velnora.UnitRegistry)[],
  TOptionalUnits extends readonly (keyof Velnora.UnitRegistry)[] = readonly (keyof Velnora.UnitRegistry)[]
> extends BaseUnit<TRequiredUnits, TOptionalUnits> {}

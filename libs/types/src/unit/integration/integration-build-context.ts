import type { BaseUnitContext } from "../unit/base-unit-context";

export interface IntegrationBuildContext<
  TRequiredUnits extends readonly (keyof Velnora.UnitRegistry)[] = readonly (keyof Velnora.UnitRegistry)[],
  TOptionalUnits extends readonly (keyof Velnora.UnitRegistry)[] = readonly (keyof Velnora.UnitRegistry)[]
> extends BaseUnitContext<TRequiredUnits, TOptionalUnits> {}

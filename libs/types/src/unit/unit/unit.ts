import type { AdapterUnit } from "./adapter-unit";
import type { IntegrationUnit } from "./integration-unit";
import type { RuntimeUnit } from "./runtime-unit";
import type { UnitKind } from "./unit-kind";

export type Unit<
  TUnitKind extends UnitKind,
  TRequiredUnits extends readonly (keyof Velnora.UnitRegistry)[],
  TOptionalUnits extends readonly (keyof Velnora.UnitRegistry)[]
> = {
  [UnitKind.INTEGRATION]: IntegrationUnit<TRequiredUnits, TOptionalUnits>;
  [UnitKind.ADAPTER]: AdapterUnit<TRequiredUnits, TOptionalUnits>;
  [UnitKind.RUNTIME]: RuntimeUnit<TRequiredUnits, TOptionalUnits>;
}[TUnitKind];

import type { LiteralUnion } from "type-fest";

import type { AdapterUnit } from "./adapter-unit";
import type { IntegrationUnit } from "./integration-unit";
import type { RuntimeUnit } from "./runtime-unit";
import type { UnitKind } from "./unit-kind";

export type Unit<
  TUnitKind extends UnitKind,
  TRequiredUnits extends LiteralUnion<keyof Velnora.UnitRegistry, string>[],
  TOptionalUnits extends LiteralUnion<keyof Velnora.UnitRegistry, string>[],
  TCapabilities extends (keyof Velnora.UnitRegistry)[]
> = {
  [UnitKind.INTEGRATION]: IntegrationUnit<TRequiredUnits, TOptionalUnits, TCapabilities>;
  [UnitKind.ADAPTER]: AdapterUnit<TRequiredUnits, TOptionalUnits, TCapabilities>;
  [UnitKind.RUNTIME]: RuntimeUnit<TRequiredUnits, TOptionalUnits, TCapabilities>;
}[TUnitKind];

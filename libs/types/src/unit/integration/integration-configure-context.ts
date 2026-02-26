import type { LiteralUnion } from "type-fest";

import type { BaseUnitContext } from "../unit/base-unit-context";

export interface IntegrationConfigureContext<
  TRequiredUnits extends LiteralUnion<keyof Velnora.UnitRegistry, string>[],
  TOptionalUnits extends LiteralUnion<keyof Velnora.UnitRegistry, string>[],
  TCapabilities extends (keyof Velnora.UnitRegistry)[]
> extends BaseUnitContext<TRequiredUnits, TOptionalUnits, TCapabilities> {}

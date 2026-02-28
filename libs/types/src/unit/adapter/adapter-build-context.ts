import type { LiteralUnion } from "type-fest";

import type { BaseUnitContext } from "../unit/base-unit-context";

export interface AdapterBuildContext<
  TRequiredUnits extends LiteralUnion<keyof Velnora.UnitRegistry, string>[],
  TOptionalUnits extends LiteralUnion<keyof Velnora.UnitRegistry, string>[]
> extends BaseUnitContext<TRequiredUnits, TOptionalUnits> {}

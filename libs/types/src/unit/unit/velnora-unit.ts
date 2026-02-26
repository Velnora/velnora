import type { LiteralUnion } from "type-fest";

import type { AdapterUnit } from "./adapter-unit";
import type { IntegrationUnit } from "./integration-unit";
import type { RuntimeUnit } from "./runtime-unit";

/**
 * Discriminated union of every unit kind recognised by the Velnora host.
 *
 * At present the union contains only {@link RuntimeUnit}. As the plugin
 * system grows, `AdapterUnit` and `IntegrationUnit` will be added here so
 * that any code accepting a `VelnoraUnit` automatically handles all
 * variants through the `kind` discriminant.
 */
export type VelnoraUnit<
  TRequiredUnits extends LiteralUnion<keyof Velnora.UnitRegistry, string>[],
  TOptionalUnits extends LiteralUnion<keyof Velnora.UnitRegistry, string>[],
  TCapabilities extends (keyof Velnora.UnitRegistry)[]
> =
  | IntegrationUnit<TRequiredUnits, TOptionalUnits, TCapabilities>
  | RuntimeUnit<TRequiredUnits, TOptionalUnits, TCapabilities>
  | AdapterUnit<TRequiredUnits, TOptionalUnits, TCapabilities>;

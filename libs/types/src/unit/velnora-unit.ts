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
  TRequiredUnits extends readonly (keyof Velnora.UnitRegistry)[] = readonly (keyof Velnora.UnitRegistry)[],
  TOptionalUnits extends readonly (keyof Velnora.UnitRegistry)[] = readonly (keyof Velnora.UnitRegistry)[]
> = IntegrationUnit<TRequiredUnits, TOptionalUnits> | RuntimeUnit<TRequiredUnits, TOptionalUnits>;

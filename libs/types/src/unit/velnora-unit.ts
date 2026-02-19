import type { RuntimeUnit } from "./runtime-unit";

/**
 * Discriminated union of every unit kind recognised by the Velnora host.
 *
 * At present the union contains only {@link RuntimeUnit}. As the plugin
 * system grows, `AdapterUnit` and `IntegrationUnit` will be added here so
 * that any code accepting a `VelnoraUnit` automatically handles all
 * variants through the `kind` discriminant.
 */
export type VelnoraUnit = RuntimeUnit;

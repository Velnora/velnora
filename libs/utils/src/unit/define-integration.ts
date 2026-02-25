import type { ConfigEnv, IntegrationUnit } from "@velnora/types";
import { UnitKind } from "@velnora/types";

import { defineUnit } from "./define-unit";

export function defineIntegration<
  TRequiredUnits extends readonly (keyof Velnora.UnitRegistry)[] = readonly (keyof Velnora.UnitRegistry)[],
  TOptionalUnits extends readonly (keyof Velnora.UnitRegistry)[] = readonly (keyof Velnora.UnitRegistry)[]
>(unit: Omit<IntegrationUnit<TRequiredUnits, TOptionalUnits>, "kind">): IntegrationUnit<TRequiredUnits, TOptionalUnits>;

export function defineIntegration<
  TRequiredUnits extends readonly (keyof Velnora.UnitRegistry)[] = readonly (keyof Velnora.UnitRegistry)[],
  TOptionalUnits extends readonly (keyof Velnora.UnitRegistry)[] = readonly (keyof Velnora.UnitRegistry)[]
>(
  unit: (env: ConfigEnv) => Omit<IntegrationUnit<TRequiredUnits, TOptionalUnits>, "kind">
): (env: ConfigEnv) => IntegrationUnit<TRequiredUnits, TOptionalUnits>;

/**
 * Factory helper that stamps `kind: UnitKind.INTEGRATION` onto an
 * integration unit definition.
 *
 * Accepts either a **static object** or a **factory function**
 * `(env: ConfigEnv) => Omit<IntegrationUnit, "kind">`. In the factory
 * case the returned wrapper defers evaluation until the environment is
 * known.
 *
 * @typeParam TRequiredUnits - Tuple of hard-dependency keys.
 * @typeParam TOptionalUnits - Tuple of soft-dependency keys.
 * @param unit - Static definition or factory function.
 * @returns An `IntegrationUnit` (or factory returning one) with `kind` set.
 *
 * @example Static form
 * ```typescript
 * export default defineIntegration({
 *   name: "react",
 *   version: "1.0.0",
 *   required: [],
 *   optional: [],
 * });
 * ```
 *
 * @example Factory form
 * ```typescript
 * export default defineIntegration((env) => ({
 *   name: env.mode === "production" ? "react-prod" : "react-dev",
 *   version: "1.0.0",
 *   required: [],
 *   optional: [],
 * }));
 * ```
 */
export function defineIntegration<
  TRequiredUnits extends readonly (keyof Velnora.UnitRegistry)[] = readonly (keyof Velnora.UnitRegistry)[],
  TOptionalUnits extends readonly (keyof Velnora.UnitRegistry)[] = readonly (keyof Velnora.UnitRegistry)[]
>(
  unit:
    | Omit<IntegrationUnit<TRequiredUnits, TOptionalUnits>, "kind">
    | ((env: ConfigEnv) => Omit<IntegrationUnit<TRequiredUnits, TOptionalUnits>, "kind">)
) {
  return defineUnit<IntegrationUnit<TRequiredUnits, TOptionalUnits>>(UnitKind.INTEGRATION, unit);
}

import { type ConfigEnv, type RuntimeUnit, UnitKind } from "@velnora/types";

import { defineUnit } from "./define-unit";

export function defineRuntime<
  TRequiredUnits extends readonly (keyof Velnora.UnitRegistry)[] = readonly (keyof Velnora.UnitRegistry)[],
  TOptionalUnits extends readonly (keyof Velnora.UnitRegistry)[] = readonly (keyof Velnora.UnitRegistry)[]
>(unit: Omit<RuntimeUnit<TRequiredUnits, TOptionalUnits>, "kind">): RuntimeUnit<TRequiredUnits, TOptionalUnits>;

export function defineRuntime<
  TRequiredUnits extends readonly (keyof Velnora.UnitRegistry)[] = readonly (keyof Velnora.UnitRegistry)[],
  TOptionalUnits extends readonly (keyof Velnora.UnitRegistry)[] = readonly (keyof Velnora.UnitRegistry)[]
>(
  unit: (env: ConfigEnv) => Omit<RuntimeUnit<TRequiredUnits, TOptionalUnits>, "kind">
): (env: ConfigEnv) => RuntimeUnit<TRequiredUnits, TOptionalUnits>;

// ToDO: Fix docs. @examples are wrong

/**
 * Creates a {@link RuntimeUnit} with the `kind` discriminant automatically set
 * to {@link UnitKind.RUNTIME}.
 *
 * `defineRuntime` supports two calling conventions:
 *
 * 1. **Static** — pass a plain configuration object. The function returns that
 *    object with `kind: UnitKind.RUNTIME` merged in.
 * 2. **Factory** — pass a function that receives a {@link ConfigEnv} and
 *    returns the configuration. The function itself is returned (wrapped so
 *    that `kind` is injected into the result at call-time). This lets
 *    consumers branch on the active CLI command or environment mode.
 *
 * @typeParam TRequiredUnits - A readonly tuple of unit name strings that
 *   **must** be present for this runtime unit to initialize. Defaults to
 *   `readonly string[]` (unconstrained).
 * @typeParam TOptionalUnits - A readonly tuple of unit name strings that this
 *   runtime unit **may** consume when available. Defaults to
 *   `readonly string[]` (unconstrained).
 *
 * @param unit - Either a static runtime configuration object (without `kind`)
 *   or a factory function `(env: ConfigEnv) => config` that produces one.
 *
 * @returns When `unit` is an **object**, returns the same object with
 *   `kind: UnitKind.RUNTIME` merged in. When `unit` is a **function**, returns
 *   a new function with the same signature that injects `kind` into the
 *   factory's return value.
 *
 * @example Static configuration
 * ```typescript
 * import { defineRuntime } from "@velnora/utils";
 *
 * export default defineRuntime({
 *   name: "node",
 *   version: "22.0.0",
 *   toolchain: { compiler: "tsc" },
 * });
 * ```
 *
 * @example Factory configuration (branching on ConfigEnv)
 * ```typescript
 * import { defineRuntime } from "@velnora/utils";
 *
 * export default defineRuntime((env) => ({
 *   name: "node",
 *   version: "22.0.0",
 *   toolchain: env.command === "build"
 *     ? { compiler: "swc" }
 *     : { compiler: "tsc" },

 * }));
 * ```
 */
export function defineRuntime<
  TRequiredUnits extends readonly (keyof Velnora.UnitRegistry)[] = readonly (keyof Velnora.UnitRegistry)[],
  TOptionalUnits extends readonly (keyof Velnora.UnitRegistry)[] = readonly (keyof Velnora.UnitRegistry)[]
>(
  unit:
    | ((env: ConfigEnv) => Omit<RuntimeUnit<TRequiredUnits, TOptionalUnits>, "kind">)
    | Omit<RuntimeUnit<TRequiredUnits, TOptionalUnits>, "kind">
) {
  return defineUnit(UnitKind.RUNTIME, unit);
}

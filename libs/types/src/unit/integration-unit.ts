import type { BaseUnit } from "./base-unit";
import type { UnitContext } from "./integration";
import type { UnitKind } from "./unit-kind";

/**
 * An **integration** unit provides framework-specific glue code that connects
 * a UI framework (React, Angular, Vue, etc.) into the Velnora host's
 * rendering, routing, and build pipelines.
 *
 * Extends {@link BaseUnit} with two optional lifecycle hooks:
 *
 * - `configure` — called during host initialisation to register APIs via
 *   {@link UnitContext.expose}.
 * - `build` — called at build time to perform framework-specific
 *   compilation or asset generation.
 *
 * @typeParam TRequiredUnits - Tuple of unit keys that **must** be present.
 * @typeParam TOptionalUnits - Tuple of unit keys that **may** be present.
 *
 * @example
 * ```typescript
 * const react: IntegrationUnit<readonly ["react-dom"]> = {
 *   name: "react",
 *   version: "1.0.0",
 *   kind: "integration",
 *   required: ["react-dom"] as const,
 *   optional: [] as const,
 *   configure(ctx) { ctx.expose("react-dom", reactDomApi); },
 * };
 * ```
 */
export interface IntegrationUnit<
  TRequiredUnits extends readonly (keyof Velnora.UnitRegistry)[] = readonly (keyof Velnora.UnitRegistry)[],
  TOptionalUnits extends readonly (keyof Velnora.UnitRegistry)[] = readonly (keyof Velnora.UnitRegistry)[]
> extends BaseUnit<TRequiredUnits, TOptionalUnits> {
  /** Discriminant — always `"integration"` for this unit kind. */
  kind: UnitKind.INTEGRATION;

  /**
   * Called during host initialisation to register public APIs and perform
   * one-time setup. Use {@link UnitContext.expose} to advertise capabilities
   * to other units.
   */
  configure?(ctx: UnitContext<TRequiredUnits, TOptionalUnits>): void | Promise<void>;

  /**
   * Called at build time to run framework-specific compilation, code
   * generation, or asset optimisation.
   */
  build?(ctx: UnitContext<TRequiredUnits, TOptionalUnits>): void | Promise<void>;
}

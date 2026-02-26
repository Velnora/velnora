import type { VelnoraUnit } from "./velnora-unit";

/**
 * The shared foundation interface for all unit kinds in Velnora's plugin system.
 *
 * Every unit -- whether it represents a language runtime, a build-tool adapter,
 * or a framework integration -- carries the same base metadata described here.
 * The two generic parameters let each concrete unit declare, at the type level,
 * which other units it depends on and which ones it can optionally leverage.
 *
 * @typeParam TRequiredUnits - A readonly tuple of unit name strings that **must**
 *   be present in the host for this unit to function. The kernel will refuse to
 *   boot if any required unit is missing.
 * @typeParam TOptionalUnits - A readonly tuple of unit name strings that this
 *   unit **can** use when available but does not strictly depend on. Missing
 *   optional units are silently ignored at boot time.
 */
export interface BaseUnit<
  TRequiredUnits extends readonly (keyof Velnora.UnitRegistry)[] = readonly (keyof Velnora.UnitRegistry)[],
  TOptionalUnits extends readonly (keyof Velnora.UnitRegistry)[] = readonly (keyof Velnora.UnitRegistry)[]
> {
  /** Unique, human-readable identifier for this unit (e.g. `"node"`, `"vite"`, `"react"`). */
  name: string;

  /** Semantic version string following semver (e.g. `"1.2.3"`). */
  version: string;

  /** Tuple of unit names that must be registered before this unit can initialize. */
  required?: TRequiredUnits;

  /** Tuple of unit names that this unit can optionally consume if they are available. */
  optional?: TOptionalUnits;

  /**
   * An optional list of capability tokens this unit advertises to the host.
   *
   * Other units may query the capability registry to discover features at
   * runtime without coupling to a specific unit by name.
   */
  capabilities?: string[];

  /**
   * An optional list of other units that this unit bundles together and re-exports as a single dependency. This is purely a type-level convenience for units that
   * are always consumed together -- it has no runtime effect and does not
   * automatically pull in the bundled units as dependencies.
   *
   * For example, a React integration unit might bundle the `react` and `react-dom`
   * units together so that consumers only have to declare a dependency on the
   * integration unit.
   */
  units?: VelnoraUnit<TRequiredUnits, TOptionalUnits>[];
}

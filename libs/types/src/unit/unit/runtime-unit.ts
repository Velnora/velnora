/**
 * @velnora-meta
 * type: author
 * author: MDReal
 */

import type { LiteralUnion } from "type-fest";

import type { Toolchain } from "../runtime";
import type { BaseUnit } from "./base-unit";
import type { UnitKind } from "./unit-kind";

/**
 * The most fundamental unit kind -- registers a language runtime or execution
 * ecosystem (e.g. Node.js, JVM, .NET) with the Velnora host.
 *
 * `RuntimeUnit` merges two concerns:
 *
 * 1. **Metadata** via {@link BaseUnit} -- name, version, dependency tuples, and
 *    advertised capabilities.
 * 2. **Lifecycle** via {@link Toolchain} -- compile, execute, test, and package
 *    hooks that the kernel invokes during the build pipeline.
 *
 * The `kind` discriminant is always {@link UnitKind.RUNTIME}, which lets the
 * kernel and type-level utilities narrow a {@link VelnoraUnit} to this
 * specific variant.
 *
 * @typeParam TRequiredUnits - A readonly tuple of unit name strings that must
 *   be present for this runtime unit to initialise. Defaults to
 *   `readonly string[]` (unconstrained).
 * @typeParam TOptionalUnits - A readonly tuple of unit name strings that this
 *   runtime unit can optionally consume. Defaults to `readonly string[]`
 *   (unconstrained).
 *
 * @see BaseUnit  -- shared metadata inherited by every unit kind.
 * @see Toolchain -- compile / execute / test / package lifecycle hooks.
 */
export interface RuntimeUnit<
  TRequiredUnits extends LiteralUnion<keyof Velnora.UnitRegistry, string>[],
  TOptionalUnits extends LiteralUnion<keyof Velnora.UnitRegistry, string>[],
  TCapabilities extends (keyof Velnora.UnitRegistry)[]
>
  extends BaseUnit<TRequiredUnits, TOptionalUnits, TCapabilities>, Toolchain<TRequiredUnits, TOptionalUnits> {
  /** Discriminant that identifies this unit as a language runtime. */
  kind: UnitKind.RUNTIME;
}

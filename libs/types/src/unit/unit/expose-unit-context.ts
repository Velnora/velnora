/**
 * @velnora-meta
 * type: author
 * author: MDReal
 */

/**
 * Context object injected into {@link IntegrationUnit} lifecycle hooks.
 *
 * Provides two core capabilities:
 *
 * - **expose** — publish a typed API under a registry key so other units can
 *   discover and consume it.
 * - **query** — look up APIs registered by required or optional peer units.
 *   Required keys are guaranteed to resolve; optional keys may return
 *   `undefined`.
 *
 * Type safety is driven by the `Velnora.UnitRegistry` declaration-merging
 * namespace — any key added there automatically appears in the `expose` and
 * `query` signatures.
 *
 * @typeParam TRequiredUnits - Tuple of hard-dependency keys (never `undefined`).
 * @typeParam TOptionalUnits - Tuple of soft-dependency keys (may be `undefined`).
 */
export interface ExposeUnitContext<
  TCapabilities extends (keyof Velnora.UnitRegistry)[] = (keyof Velnora.UnitRegistry)[]
> {
  /** Register a public API for a single capability. */
  expose<TKey extends TCapabilities[number]>(
    key: TKey,
    api: TKey extends keyof Velnora.UnitRegistry ? Velnora.UnitRegistry[TKey] : never
  ): void;

  /** Register a public API for multiple capabilities at once. */
  expose(api: {
    [TProp in TCapabilities[number]]?: TProp extends keyof Velnora.UnitRegistry ? Velnora.UnitRegistry[TProp] : never;
  }): void;
}

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
export interface UnitContext<
  TRequiredUnits extends readonly (keyof Velnora.UnitRegistry)[] = readonly [],
  TOptionalUnits extends readonly (keyof Velnora.UnitRegistry)[] = readonly []
> {
  /** Register a public API for a single capability. */
  expose<TKey extends keyof Velnora.UnitRegistry>(key: TKey, api: Velnora.UnitRegistry[TKey]): void;

  /** Register a public API for multiple capabilities at once. */
  expose<TKey extends keyof Velnora.UnitRegistry>(keys: readonly TKey[], api: Velnora.UnitRegistry[TKey]): void;

  /** Query a hard dependency — guaranteed to exist, never undefined. */
  query<TKey extends TRequiredUnits[number]>(key: TKey): Velnora.UnitRegistry[TKey];

  /** Query a soft dependency — returns undefined if not installed. */
  query<TKey extends TOptionalUnits[number]>(key: TKey): Velnora.UnitRegistry[TKey] | undefined;

  /** Query multiple hard dependencies — returns a mapped object. */
  query<TKey extends TRequiredUnits[number]>(keys: readonly TKey[]): { [TProp in TKey]: Velnora.UnitRegistry[TProp] };

  /** Query multiple soft dependencies — each value may be undefined. */
  query<TKey extends TOptionalUnits[number]>(keys: readonly TKey[]): { [TProp in TKey]?: Velnora.UnitRegistry[TProp] };
}

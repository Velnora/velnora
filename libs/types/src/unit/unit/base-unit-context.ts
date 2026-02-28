/**
 * @velnora-meta
 * type: author
 * author: MDReal
 */
import type { LiteralUnion } from "type-fest";

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
export interface BaseUnitContext<
  TRequiredUnits extends LiteralUnion<keyof Velnora.UnitRegistry, string>[] = LiteralUnion<
    keyof Velnora.UnitRegistry,
    string
  >[],
  TOptionalUnits extends LiteralUnion<keyof Velnora.UnitRegistry, string>[] = LiteralUnion<
    keyof Velnora.UnitRegistry,
    string
  >[]
> {
  /** Query a hard dependency — guaranteed to exist, never undefined. */
  query<TKey extends TRequiredUnits[number]>(
    key: TKey
  ): TKey extends keyof Velnora.UnitRegistry ? Velnora.UnitRegistry[TKey] : unknown;

  /** Query a soft dependency — returns undefined if not installed. */
  query<TKey extends TOptionalUnits[number]>(
    key: TKey
  ): TKey extends keyof Velnora.UnitRegistry ? Velnora.UnitRegistry[TKey] | undefined : unknown;

  /** Query multiple hard dependencies — returns a mapped object. */
  query(keys: TRequiredUnits): {
    [TProp in TRequiredUnits[number]]: TProp extends keyof Velnora.UnitRegistry ? Velnora.UnitRegistry[TProp] : unknown;
  };

  /** Query multiple soft dependencies — each value may be undefined. */
  query(keys: TOptionalUnits): {
    [TProp in TOptionalUnits[number]]?: TProp extends keyof Velnora.UnitRegistry
      ? Velnora.UnitRegistry[TProp]
      : unknown;
  };
}

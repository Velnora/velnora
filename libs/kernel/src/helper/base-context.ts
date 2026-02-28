/**
 * @velnora-meta
 * type: author
 * author: MDReal
 */
import type { LiteralUnion } from "type-fest";

import type { BaseUnitContext, ExposeUnitContext } from "@velnora/types";

const globalRegistrySymbol = Symbol.for("Velnora.UnitRegistry");

export class BaseContext<
  TRequiredUnits extends (keyof Velnora.UnitRegistry)[] = (keyof Velnora.UnitRegistry)[],
  TOptionalUnits extends (keyof Velnora.UnitRegistry)[] = (keyof Velnora.UnitRegistry)[],
  TCapabilities extends (keyof Velnora.UnitRegistry)[] = (keyof Velnora.UnitRegistry)[]
>
  implements BaseUnitContext<TRequiredUnits, TOptionalUnits>, ExposeUnitContext<TCapabilities>
{
  expose<TKey extends TCapabilities[number]>(
    key: TKey,
    api: TKey extends keyof Velnora.UnitRegistry ? Velnora.UnitRegistry[TKey] : never
  ): void;
  expose(api: {
    [TProp in TCapabilities[number]]?: TProp extends keyof Velnora.UnitRegistry ? Velnora.UnitRegistry[TProp] : never;
  }): void;
  expose<TKey extends TCapabilities[number]>(
    keyOrApi:
      | TKey
      | { [TProp in TKey]?: TProp extends keyof Velnora.UnitRegistry ? Velnora.UnitRegistry[TProp] : never },
    api?: TKey extends keyof Velnora.UnitRegistry ? Velnora.UnitRegistry[TKey] : never
  ) {}

  query<TKey extends TRequiredUnits[number]>(
    key: TKey
  ): TKey extends keyof Velnora.UnitRegistry ? Velnora.UnitRegistry[TKey] : never;
  query<TKey extends TOptionalUnits[number]>(
    key: TKey
  ): TKey extends keyof Velnora.UnitRegistry ? Velnora.UnitRegistry[TKey] | undefined : never;
  query(keys: TRequiredUnits): {
    [TProp in TRequiredUnits[number]]: TProp extends keyof Velnora.UnitRegistry ? Velnora.UnitRegistry[TProp] : never;
  };
  query(keys: TOptionalUnits): {
    [TProp in TOptionalUnits[number]]?: TProp extends keyof Velnora.UnitRegistry ? Velnora.UnitRegistry[TProp] : never;
  };
  query<TKey extends TRequiredUnits[number] | TOptionalUnits[number]>(
    keyOrKeys: TKey | TKey[]
  ):
    | TKey
    | (TKey extends TRequiredUnits[number]
        ? { [TProp in TKey]: TProp extends keyof Velnora.UnitRegistry ? Velnora.UnitRegistry[TProp] : never }
        : { [TProp in TKey]?: TProp extends keyof Velnora.UnitRegistry ? Velnora.UnitRegistry[TProp] : never }) {}

  private get(key: LiteralUnion<keyof Velnora.UnitRegistry, string>) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const registry = globalThis[globalRegistrySymbol] as Partial<Velnora.UnitRegistry> | undefined;

    if (!registry) {
      throw new Error(
        "[Velnora] No global registry found. Are you sure this code is running within a Velnora unit lifecycle hook?"
      );
    }

    if (!(key in registry)) {
      throw new Error(`[Velnora] No API found for key "${key}". Did you forget to expose it in a peer unit?`);
    }

    return registry[key as keyof Velnora.UnitRegistry];
  }

  private set<TKey extends TCapabilities[number]>(
    key: TKey,
    api: TKey extends keyof Velnora.UnitRegistry ? Velnora.UnitRegistry[TKey] : never
  ) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const registry = globalThis[globalRegistrySymbol] as Partial<Velnora.UnitRegistry> | undefined;

    if (!registry) {
      throw new Error(
        "[Velnora] No global registry found. Are you sure this code is running within a Velnora unit lifecycle hook?"
      );
    }

    if (key in registry) {
      throw new Error(
        `[Velnora] API key "${key}" is already registered. Each capability can only be exposed by one unit.`
      );
    }

    registry[key] = api;
  }
}

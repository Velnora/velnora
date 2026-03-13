/**
 * @velnora-meta
 * type: author
 * author: MDReal
 */
import type { Promisable } from "type-fest";

import type { BaseUnitContext, ExposeUnitContext, VelnoraUnit } from "@velnora/types";
import { CONTEXT_REGISTRY, GlobalRegistry, UNITS_REGISTRY } from "@velnora/utils";

import type { ExposeItem } from "../types/expose-item";

export class BaseContext implements BaseUnitContext, ExposeUnitContext {
  private static readonly _registry = GlobalRegistry.use(UNITS_REGISTRY);
  private static readonly _warned = GlobalRegistry.use<true>(UNITS_REGISTRY.warnings);
  private static readonly _aliases = GlobalRegistry.use<string>(UNITS_REGISTRY.aliases);
  private static readonly _baseContextRegistry = GlobalRegistry.use<BaseContext>(
    CONTEXT_REGISTRY,
    CONTEXT_REGISTRY.base
  );

  private static _config: VelnoraConfig | null = null;
  private static _batchDepth = 0;
  private static _queue: ExposeItem[] = [];

  static setConfig(config: VelnoraConfig) {
    this._config = config;
  }

  static async batch<T>(fn: () => Promisable<T>): Promise<T> {
    BaseContext._batchDepth++;

    try {
      return await fn();
    } finally {
      BaseContext._batchDepth--;
      if (BaseContext._batchDepth === 0) BaseContext.flush();
    }
  }

  static for(unit: VelnoraUnit) {
    if (this._baseContextRegistry.has(unit.name)) {
      return this._baseContextRegistry.get(unit.name)!;
    }
    const context = new BaseContext(unit);
    this._baseContextRegistry.set(unit.name, context);
    return context;
  }

  static flush() {
    const items = BaseContext._queue;
    if (items.length === 0) return;

    BaseContext._queue = [];

    for (const item of items) {
      if (item.kind === "resolve") {
        BaseContext._aliases.set(item.key, item.resolveKey);
        continue;
      }

      BaseContext._registry.set(item.key, item.value);
    }
  }

  private constructor(private readonly unit: VelnoraUnit) {}

  private warnOnce(id: string, message: string) {
    if (BaseContext._warned.has(id)) return;
    BaseContext._warned.set(id, true);
    console.warn(message);
  }

  private resolveUnitKey(input: string) {
    const configMap = BaseContext._config?.resolve?.units ?? {};
    let key = input;

    const seen = new Set<string>();

    while (true) {
      if (seen.has(key)) {
        this.warnOnce(
          `resolve:cycle:${input}`,
          this
            .unitLabel`Warning: unit key resolution cycle detected starting from "${input}". Resolution stopped at "${key}".`
        );
        break;
      }

      seen.add(key);

      const alias = BaseContext._aliases.get(key);
      if (alias) {
        key = alias;
        continue;
      }

      const cfg = configMap[key];
      if (cfg) {
        key = cfg;
        continue;
      }

      break;
    }

    return key;
  }

  private resolveKeyOrWarn(input: string) {
    const canonical = this.resolveUnitKey(input);

    if (canonical !== input && !BaseContext._registry.has(canonical)) {
      this.warnOnce(
        `resolve:missing:${input}->${canonical}`,
        this
          .unitLabel`Warning: API key "${input}" is configured to resolve from "${canonical}", but no value found for "${canonical}". Falling back to "${input}".`
      );
      return input;
    }

    return canonical;
  }

  private enqueue(item: ExposeItem) {
    BaseContext._queue.push(item);
    if (BaseContext._batchDepth === 0) BaseContext.flush();
  }

  private unitLabel(strings: TemplateStringsArray, ...values: Array<string | number | boolean | null | undefined>) {
    const name = this.unit.name;

    let out = strings[0] ?? "";
    for (let i = 0; i < values.length; i++) out += String(values[i]) + (strings[i + 1] ?? "");

    return `[${name}] ${out}`;
  }

  expose<TKey extends keyof Velnora.UnitRegistry>(key: string, api: Velnora.UnitRegistry[TKey]): void;
  expose(api: { [TProp in keyof Velnora.UnitRegistry]?: Velnora.UnitRegistry[TProp] }): void;
  expose<TKey extends keyof Velnora.UnitRegistry>(
    keyOrApi: TKey | { [TProp in keyof Velnora.UnitRegistry]?: Velnora.UnitRegistry[TProp] },
    api?: Velnora.UnitRegistry[TKey]
  ) {
    const apiObject = typeof keyOrApi === "string" ? { [keyOrApi]: api } : keyOrApi;
    const configMap = BaseContext._config?.resolve?.units ?? {};

    for (const rawKey in apiObject) {
      const configuredResolveKey = configMap[rawKey];

      if (configuredResolveKey) {
        this.enqueue({ kind: "resolve", key: rawKey, resolveKey: configuredResolveKey });
      }

      const canonicalKey = this.resolveUnitKey(rawKey);

      if (BaseContext._registry.has(canonicalKey) && !configuredResolveKey) {
        this.warnOnce(
          `expose:duplicate:${canonicalKey}`,
          this.unitLabel`Warning: API key "${canonicalKey}" is already registered. Skipping duplicate registration. ` +
            `If need to define another value pls set resolve.units.${canonicalKey} in config to override instead of warn.`
        );
        continue;
      }

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const value = apiObject[rawKey];
      this.enqueue({ kind: "set", key: canonicalKey, value });
    }
  }

  query<TKey extends keyof Velnora.UnitRegistry>(key: TKey): Velnora.UnitRegistry[TKey];
  query<TKey extends keyof Velnora.UnitRegistry>(key: TKey): Velnora.UnitRegistry[TKey];
  query(...keys: (keyof Velnora.UnitRegistry)[]): {
    [TProp in keyof Velnora.UnitRegistry]: Velnora.UnitRegistry[TProp];
  };
  query(...keys: (keyof Velnora.UnitRegistry)[]): {
    [TProp in keyof Velnora.UnitRegistry]?: Velnora.UnitRegistry[TProp];
  };
  query<TKey extends keyof Velnora.UnitRegistry>(
    keyOrKeys: TKey | TKey[]
  ): TKey | { [TProp in TKey]?: Velnora.UnitRegistry[TProp] } {
    if (typeof keyOrKeys === "string") {
      const canonical = this.resolveKeyOrWarn(keyOrKeys);
      return BaseContext._registry.get(canonical) as Velnora.UnitRegistry[TKey];
    }

    const result: { [TProp in TKey]?: Velnora.UnitRegistry[TProp] } = {};
    for (const key of keyOrKeys) {
      const canonical = this.resolveKeyOrWarn(key);
      result[key] = BaseContext._registry.get(canonical);
    }

    return result;
  }
}

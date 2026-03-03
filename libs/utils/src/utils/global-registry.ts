export class GlobalRegistry<TItem> {
  private readonly store: Map<string | symbol, TItem>;
  private readonly prefix: string;

  constructor(namespace: string, prefix = "") {
    const g = globalThis as unknown as Record<string, unknown>;

    const existing = g[namespace];
    if (existing instanceof Map) {
      this.store = existing as Map<string | symbol, TItem>;
    } else {
      const map = new Map<string | symbol, TItem>();
      g[namespace] = map;
      this.store = map;
    }

    this.prefix = prefix;
  }

  get size() {
    return this.store.size;
  }

  /**
   * Get (or create) a global Map for a namespace
   * and return a scoped registry instance.
   */
  static use<TItem>(namespace: string, prefix = "") {
    return new GlobalRegistry<TItem>(namespace, prefix);
  }

  set(key: string | symbol, value: TItem) {
    this.store.set(this.k(key), value);
  }

  setIfAbsent(key: string | symbol, value: TItem) {
    const kk = this.k(key);
    if (!this.store.has(kk)) {
      this.store.set(kk, value);
    }
  }

  get<TValue = TItem>(key: string | symbol) {
    return this.store.get(this.k(key)) as TValue | undefined;
  }

  getOrThrow<TValue = TItem>(key: string | symbol): TValue {
    const kk = this.k(key);
    if (!this.store.has(kk)) {
      throw new Error(`GlobalRegistry: key "${String(kk)}" not found`);
    }
    return this.store.get(kk) as TValue;
  }

  getOrCreate<TValue = TItem>(key: string, defaultValue?: TValue): TValue {
    const kk = this.k(key);
    if (!this.store.has(kk)) {
      if (defaultValue === undefined) {
        throw new Error(`GlobalRegistry: key "${String(kk)}" not found and no default value provided`);
      }
      this.store.set(kk, defaultValue as unknown as TItem);
    }
    return this.store.get(kk) as unknown as TValue;
  }

  getAll<TValue = TItem>() {
    const kkPrefix = this.k("");
    return Array.from(this.store.entries())
      .filter(([k]) => (typeof k === "string" ? k.startsWith(kkPrefix) : k))
      .map(([, v]) => v as unknown as TValue);
  }

  has(key: string | symbol) {
    return this.store.has(this.k(key));
  }

  delete(key: string | symbol) {
    return this.store.delete(this.k(key));
  }

  clear() {
    this.store.clear();
  }

  keys() {
    return Array.from(this.store.keys());
  }

  values() {
    return Array.from(this.store.values());
  }

  entries() {
    return Object.fromEntries(Array.from(this.store.entries()).filter(([k]) => typeof k === "string")) as Record<
      string,
      TItem
    >;
  }

  entriesAll() {
    return Array.from(this.store.entries());
  }

  forEach(callback: (value: TItem, key: string | symbol) => void) {
    this.store.forEach(callback);
  }

  private k<TKey extends string | symbol>(key: TKey): TKey {
    if (!this.prefix || typeof key !== "string") return key;
    return `${this.prefix}:${key}` as TKey;
  }
}

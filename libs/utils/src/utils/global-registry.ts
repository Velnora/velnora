export class GlobalRegistry {
  private readonly store: Map<string | symbol, unknown>;
  private readonly prefix: string;

  /**
   * Get (or create) a global Map for a namespace
   * and return a scoped registry instance.
   */
  static use(namespace: string, prefix = "") {
    return new GlobalRegistry(namespace, prefix);
  }

  constructor(namespace: string, prefix = "") {
    const g = globalThis as unknown as Record<string, unknown>;

    const existing = g[namespace];
    if (existing instanceof Map) {
      this.store = existing as Map<string | symbol, unknown>;
    } else {
      const map = new Map<string | symbol, unknown>();
      g[namespace] = map;
      this.store = map;
    }

    this.prefix = prefix;
  }

  private k(key: string | symbol) {
    if (!this.prefix || typeof key !== "string") return key;
    return `${this.prefix}:${key}`;
  }

  get size() {
    return this.store.size;
  }

  set(key: string | symbol, value: unknown) {
    this.store.set(this.k(key), value);
  }

  setIfAbsent(key: string | symbol, value: unknown) {
    const kk = this.k(key);
    if (!this.store.has(kk)) {
      this.store.set(kk, value);
    }
  }

  get<TValue = unknown>(key: string | symbol) {
    return this.store.get(this.k(key)) as TValue | undefined;
  }

  getOrThrow<TValue = unknown>(key: string | symbol): TValue {
    const kk = this.k(key);
    if (!this.store.has(kk)) {
      throw new Error(`GlobalRegistry: key "${String(kk)}" not found`);
    }
    return this.store.get(kk) as TValue;
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
      unknown
    >;
  }

  entriesAll() {
    return Array.from(this.store.entries());
  }

  forEach(callback: (value: unknown, key: string | symbol) => void) {
    this.store.forEach(callback);
  }
}

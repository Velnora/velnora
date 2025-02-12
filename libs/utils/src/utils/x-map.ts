export class XMap<TKey, TValue> extends Map<TKey, TValue> {
  getOrDefault(key: TKey, defaultValue: TValue): TValue {
    if (this.has(key)) return this.get(key)!;
    this.set(key, defaultValue);
    return defaultValue;
  }
}

export class XSet<TValue> extends Set<TValue> implements Omit<Set<TValue>, "add"> {
  add(...values: TValue[]): this {
    for (const value of values) {
      super.add(value);
    }
    return this;
  }

  toSet() {
    return new Set(this);
  }
}

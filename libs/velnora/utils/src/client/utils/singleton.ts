export const singleton = <TObject>(key: string, value: () => TObject): TObject => {
  const property = Object.getOwnPropertyDescriptor(globalThis, key);
  if (property) {
    return property.get?.() || property.value;
  }

  const instance = value();
  Object.defineProperty(globalThis, key, {
    value: instance,
    writable: false,
    enumerable: false,
    configurable: false
  });
  return instance;
};

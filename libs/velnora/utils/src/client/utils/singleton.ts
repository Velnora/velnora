import type { Type } from "@nestjs/common";

const symbols = new Map<string, symbol>();

export const singleton = <TObject>(Class: Type<TObject>, name = Class.name): TObject => {
  const clsNameStartIndex = Class.name.lastIndexOf("(");
  const clsNameEndIndex = Class.name.indexOf(")");
  const key = `Velnora.${name.slice(
    clsNameStartIndex === -1 ? 0 : clsNameStartIndex + 1,
    clsNameEndIndex === -1 ? Class.name.length : clsNameEndIndex
  )}.instance`;

  if (!symbols.has(key)) {
    symbols.set(key, Symbol(key));
  }

  const property = Object.getOwnPropertyDescriptor(globalThis, symbols.get(key)!);
  if (property) return property.get?.() || property.value;

  const instance = new Class();
  Object.defineProperty(globalThis, symbols.get(key)!, {
    value: instance,
    writable: false,
    enumerable: false,
    configurable: false
  });
  return instance;
};

export const singletonValue = <TValue>(getValue: () => TValue, name: string): TValue => {
  const clsNameStartIndex = name.lastIndexOf("(");
  const clsNameEndIndex = name.indexOf(")");
  const key = `Velnora.${name.slice(
    clsNameStartIndex === -1 ? 0 : clsNameStartIndex + 1,
    clsNameEndIndex === -1 ? name.length : clsNameEndIndex
  )}.value`;

  if (!symbols.has(key)) {
    symbols.set(key, Symbol(key));
  }

  const property = Object.getOwnPropertyDescriptor(globalThis, symbols.get(key)!);
  if (property) return property.get?.() || property.value;

  const value = getValue();
  Object.defineProperty(globalThis, symbols.get(key)!, {
    value,
    writable: false,
    enumerable: false,
    configurable: false
  });
  return value;
};

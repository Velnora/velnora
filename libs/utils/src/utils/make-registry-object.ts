import { types } from "node:util";

import type { PlainObject } from "../types/plain-object";
import type { RegistryString } from "../types/registry-string";
import { isPlainObject } from "./is-plain-object";

/**
 * Rebuilds a registry into stable colon-path identifiers.
 *
 * Rules:
 * - If value is string -> leaf becomes `:${ancestors...}:${value}`
 * - If value is a RegistryString -> it is rebuilt using its own string name + props, under current ancestors
 * - If value is a plain object -> treated as "inline namespace" where the key becomes the namespace name
 */
const buildRegistry = <TObject extends PlainObject>(
  name: string,
  input: TObject,
  ancestors: string[] = []
): RegistryString<TObject> => {
  const out: PlainObject = {};
  const prefixParts = [...ancestors, name];

  for (const [key, value] of Object.entries(input ?? {})) {
    // Leaf: string value becomes final segment
    if (typeof value === "string") {
      out[key] = [...prefixParts, value].join(":");
      continue;
    }

    // Nested registry: rebuild it under current prefix
    if (types.isStringObject(value)) {
      const childName = value.toString();
      const childProps = Object.fromEntries(Object.entries(value)); // enumerable props only
      out[key] = buildRegistry(childName, childProps, prefixParts);
      continue;
    }

    // Inline object namespace (optional convenience)
    if (isPlainObject(value)) {
      out[key] = buildRegistry(key, value, prefixParts);
      continue;
    }

    out[key] = value;
  }

  return Object.assign(String(prefixParts.join(":")), out) as RegistryString<TObject>;
};

export const makeRegistryObject = <TObject extends PlainObject>(
  name: string,
  extendedValue?: TObject
): RegistryString<TObject> => buildRegistry(name, extendedValue ?? ({} as TObject));

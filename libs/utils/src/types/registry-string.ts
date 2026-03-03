import type { RegistryObject } from "./registry-object";

export type RegistryString<T extends Record<string, string | RegistryObject>> = string & {
  [K in keyof T]: T[K] extends object ? RegistryString<T[K]> : string;
};

/// <reference types="velnora/client" />

declare module "velnora:applications" {
  import type { Package } from "@velnora/types";

  export const applications: Package[];
  export const applicationsMap: Map<string, Package>;
}

declare module "velnora:bootstrap" {
  const _default: Record<string, string>;
  export default _default;
}

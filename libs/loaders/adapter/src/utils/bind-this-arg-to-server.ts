import type { AdapterServer, NestJsAdapterOptions } from "../core/adapter";

export function bindThisArg(this: AdapterServer | NestJsAdapterOptions, value: any) {
  return typeof value === "function" ? value.bind(this.parentClass.server) : () => value;
}

import type { Name, Path } from "@fluxora/types";

import type { RemoteFrom } from "./remote-from";

export interface RemoteLibrary extends Record<string, any> {
  init(wrapShareScope: any): void;

  __esModule?: boolean;
  [Symbol.toStringTag]: string;
  default?: Record<string, any>;
}

export interface RemoteApp {
  name: string;
  url: string;
  modules?: Record<Path, Name[]>;
  format: "var" | "esm" | "systemjs";
  from: RemoteFrom;

  inited?: boolean;
  lib?: RemoteLibrary;
}

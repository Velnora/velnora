import type { Package } from "@velnora/types";

import type { PathObjectBase } from "./path-object-base";

export interface AppPathObject extends PathObjectBase {
  type: "app";
  app: Package;
}

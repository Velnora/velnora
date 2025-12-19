import type { PathObjectBase } from "./path-object-base";

export interface ExternalPathObject extends PathObjectBase {
  type: "external";
  url: URL;
}

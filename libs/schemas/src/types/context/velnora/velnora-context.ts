import type { Router } from "../../core";
import type { AppModuleGraph } from "../../module-graph";
import type { Package } from "../../package";
import type { AstApi } from "./ast-api";
import type { FsApi } from "./fs-api";
import type { Logger } from "./logger";
import type { PkgApi } from "./pkg-api";
import type { RegistryApi } from "./registry-api";
import type { ViteApi } from "./vite-api";

export interface VelnoraContext {
  app: Package;
  root: string;
  graph: AppModuleGraph;
  // router: Router;
  pkg: PkgApi;
  vite: ViteApi;
  fs: FsApi;
  // ast: AstApi;
  // registry: RegistryApi;
  // logger: Logger;
}

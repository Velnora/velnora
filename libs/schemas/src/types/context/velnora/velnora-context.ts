import type { Logger } from "../../logger";
import type { AppModuleGraph } from "../../module-graph";
import type { Package } from "../../package";
import type { Routing } from "../../router";
import type { FsApi } from "./fs-api";
import type { PkgApi } from "./pkg-api";
import type { ViteApi } from "./vite-api";

export interface VelnoraContext {
  app: Package;
  root: string;
  graph: AppModuleGraph;
  router: Routing;
  pkg: PkgApi;
  vite: ViteApi;
  fs: FsApi;
  logger: Logger;
}

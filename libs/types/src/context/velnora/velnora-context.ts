import type { Logger } from "../../logger";
import type { Package } from "../../package";
import type { Routing } from "../../router";
import type { FsApi } from "./fs-api";
import type { PkgApi } from "./pkg-api";
import type { ViteApi } from "./vite-api";

export interface VelnoraContext {
  root: string;
  app: Package;
  pkg: PkgApi;
  router: Routing;
  fs: FsApi;
  vite: ViteApi;
  logger: Logger;
}

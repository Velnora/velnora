import type { ViteDevServer } from "vite";

import type { Type } from "@nestjs/common";

export interface BootstrapFnOptions {
  AppModule: Type;
  vite: ViteDevServer;
}

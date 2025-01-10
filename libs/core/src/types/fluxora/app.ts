import type { Server } from "node:http";

import type { ViteOptions } from "./vite-options";

export interface App {
  host: string;
  vite: ViteOptions;
  server: Server;
}

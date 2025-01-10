import type { UserConfig, ViteDevServer } from "vite";

export interface ViteOptions {
  wsPort: number;
  config: UserConfig;
  devServer: ViteDevServer;
}

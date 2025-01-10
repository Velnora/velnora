import { resolve } from "node:path";

import { type InlineConfig, type UserConfig, mergeConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

import react from "@vitejs/plugin-react-swc";

import { prettierPlugin } from "../../plugins/dev/prettier.plugin";
import { fluxoraPlugin } from "../../plugins/main/fluxora.plugin";
import { microNestAppPlugin } from "../../plugins/server/micro-nest-app.plugin";
import type { FluxoraApp } from "../../types";

export const getServerConfiguration = (config: FluxoraApp, appSpecificConfig: UserConfig = {}): InlineConfig => {
  const port = +new URL(config.server.host, "http://localhost").port;

  const appConfig: InlineConfig = {
    root: config.app.root,
    configFile: config.vite?.configFile,
    server: { port, host: true, middlewareMode: true },
    build: { ssr: true, emptyOutDir: true, outDir: resolve(process.cwd(), "build", config.app.name) },
    plugins: [
      tsconfigPaths({ root: process.cwd(), projects: ["tsconfig.json"] }),
      react({ tsDecorators: true }),
      fluxoraPlugin(config),
      microNestAppPlugin(config),
      prettierPlugin()
    ],
    logLevel: "silent",
    appType: "custom"
  };

  if (config.server.vite?.wsPort) {
    appConfig.server!.hmr = { path: "/ws", protocol: "ws", port: config.server.vite.wsPort };
  }

  return mergeConfig(appConfig, appSpecificConfig);
};

import { resolve } from "node:path";

import { type InlineConfig, type UserConfig, mergeConfig } from "vite";
import inspect from "vite-plugin-inspect";
import tsconfigPaths from "vite-tsconfig-paths";

import react from "@vitejs/plugin-react-swc";

import { fluxoraPlugin } from "../../plugins/client/fluxora-entry/fluxora.plugin";
import { microNestAppPlugin } from "../../plugins/server/micro-nest-app.plugin";
import type { FluxoraApp } from "../../types";

export const getServerConfiguration = (config: FluxoraApp, appSpecificConfig: UserConfig = {}): InlineConfig => {
  const port = +new URL(config.app.host.serverHost, "http://localhost").port;

  const appConfig: InlineConfig = {
    root: config.app.root,
    mode: process.env.NODE_ENV,
    configFile: config.vite?.configFile,
    cacheDir: resolve(process.cwd(), ".fluxora/cache/apps", config.app.name, "server"),
    server: { port, host: true, middlewareMode: true },
    build: { ssr: true, emptyOutDir: true, outDir: resolve(process.cwd(), "build", config.app.name) },
    plugins: [
      tsconfigPaths({ root: process.cwd(), projects: ["tsconfig.json"] }),
      react({ tsDecorators: true }),
      inspect(),
      fluxoraPlugin(config),
      microNestAppPlugin(config)
    ],
    logLevel: "silent",
    appType: "custom"
  };

  return mergeConfig(appConfig, appSpecificConfig);
};

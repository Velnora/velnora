import { resolve } from "node:path";

import { type InlineConfig, type UserConfig, mergeConfig } from "vite";
import inspect from "vite-plugin-inspect";
import tsconfigPaths from "vite-tsconfig-paths";

import react from "@vitejs/plugin-react-swc";

import { dynamicFederationPlugin } from "../../plugins/client/dynamic-federation.plugin";
import { fluxoraPlugin } from "../../plugins/client/fluxora-entry/fluxora.plugin";
import type { FluxoraApp } from "../../types";

export const getClientConfiguration = async (
  config: FluxoraApp,
  appSpecificConfig: UserConfig = {}
): Promise<InlineConfig> => {
  const port = +new URL(config.app.host.clientHost, "http://localhost").port;

  const appConfig: InlineConfig = {
    root: config.app.root,
    mode: process.env.NODE_ENV,
    configFile: config.vite?.configFile,
    server: { port, host: true, ws: false, watch: {} },
    cacheDir: resolve(process.cwd(), ".fluxora/cache/apps", config.app.name, "client"),
    plugins: [
      inspect(),
      tsconfigPaths({ root: process.cwd(), projects: ["tsconfig.json"] }),
      react({ tsDecorators: true }),
      fluxoraPlugin(config),
      await dynamicFederationPlugin(config)
    ],
    logLevel: "silent",
    appType: "custom"
  };

  if (appConfig.mode === "development" && config.app.host.devWsPort) {
    appConfig.server!.ws = undefined;
    appConfig.server!.hmr = { host: "localhost", path: "hmr", protocol: "ws", port: config.app.host.devWsPort };
  }

  return mergeConfig(appConfig, appSpecificConfig);
};

import { resolve } from "node:path";

import { type InlineConfig, type UserConfig, mergeConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

import react from "@vitejs/plugin-react-swc";

import { dynamicFederationPlugin } from "../../plugins/client/dynamic-federation.plugin";
import { fluxoraPlugin } from "../../plugins/client/fluxora-entry/fluxora.plugin";
import type { FluxoraApp } from "../../types";

export const getClientConfiguration = async (
  config: FluxoraApp,
  appSpecificConfig: UserConfig = {}
): Promise<InlineConfig> => {
  const port = +new URL(config.client.host, "http://localhost").port;

  const appConfig: InlineConfig = {
    root: config.app.root,
    configFile: config.vite?.configFile,
    server: { port, host: true, watch: {} },
    cacheDir: resolve(process.cwd(), ".fluxora/cache/apps", config.app.name, "client"),
    plugins: [
      tsconfigPaths({ root: process.cwd(), projects: ["tsconfig.json"] }),
      react({ tsDecorators: true }),
      fluxoraPlugin(config)
      await dynamicFederationPlugin(config),
    ],
    logLevel: "silent",
    appType: "custom"
  };

  if (config.client.vite?.wsPort) {
    appConfig.server!.hmr = { path: "/ws/hmr", protocol: "ws", port: config.client.vite.wsPort };
  }

  return mergeConfig(appConfig, appSpecificConfig);
};

import { resolve } from "node:path";

import type { InlineConfig } from "vite";

import type { FluxoraApp } from "@fluxora/types/core";
import { PACKAGE_ENTRIES, VITE_ENVIRONMENTS } from "@fluxora/utils";

import { fluxoraPlugin } from "../plugins/fluxora-entry/fluxora.plugin";
import { logger } from "../utils/logger";

export const getAppConfiguration = async (config: FluxoraApp): Promise<InlineConfig> => {
  const port = +new URL(config.app.host.host, "http://localhost").port;

  const viteConfig: InlineConfig = {
    root: config.app.root,
    mode: process.env.NODE_ENV,
    configFile: config.vite.configFile,
    server: { port, host: true, ws: false, watch: {} },
    build: { outDir: "build" },
    cacheDir: resolve(process.cwd(), ".fluxora/cache/apps", config.app.name),
    plugins: [fluxoraPlugin(config)],
    logLevel: "silent",
    appType: "custom",
    environments: {
      [VITE_ENVIRONMENTS.SERVER]: {
        build: {
          ssr: true,
          lib: { entry: { server: PACKAGE_ENTRIES.FLUXORA_SERVER_ENTRY }, formats: ["es"] }
        },
        consumer: "server"
      },
      [VITE_ENVIRONMENTS.CLIENT]: {
        build: {
          lib: { entry: { client: PACKAGE_ENTRIES.FLUXORA_CLIENT_ENTRY_CLIENT_REACT }, formats: ["es"] }
        }
      },
      [VITE_ENVIRONMENTS.SSR]: {
        build: {
          ssr: true,
          lib: { entry: { client: PACKAGE_ENTRIES.FLUXORA_CLIENT_ENTRY_CLIENT_REACT }, formats: ["es"] }
        }
      }
    },
    builder: {
      async buildApp(builder) {
        logger.info(`Building (${config.app.name})`);
        await builder.build(builder.environments[VITE_ENVIRONMENTS.SERVER]);
        await builder.build(builder.environments[VITE_ENVIRONMENTS.CLIENT]);
        await builder.build(builder.environments[VITE_ENVIRONMENTS.SSR]);
      }
    }
  };

  if (viteConfig.mode === "development" && config.app.host.devWsPort) {
    viteConfig.server!.ws = undefined;
    viteConfig.server!.hmr = { host: "localhost", path: "hmr", protocol: "ws", port: config.app.host.devWsPort };
  }

  return viteConfig;
};

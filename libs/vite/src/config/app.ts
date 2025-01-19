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
    build: {
      emptyOutDir: true,
      sourcemap: true,
      ssrManifest: "ssr-manifest.json",
      rollupOptions: { external: [/^@fluxora\/(?!server|client)\/?.*/] }
    },
    cacheDir: resolve(process.cwd(), ".fluxora/apps", config.app.name, ".vite"),
    plugins: [fluxoraPlugin(config)],
    logLevel: "silent",
    appType: "custom",
    environments: {
      [VITE_ENVIRONMENTS.SERVER]: {
        build: {
          ssr: true,

          lib: { entry: { server: PACKAGE_ENTRIES.FLUXORA_SERVER_ENTRY }, formats: ["es"] },
          outDir: resolve(process.cwd(), "build", config.app.name, "server")
        },
        consumer: "server"
      },
      [VITE_ENVIRONMENTS.CLIENT]: {
        build: {
          minify: true,
          manifest: "manifest.json",
          lib: { entry: { client: PACKAGE_ENTRIES.FLUXORA_CLIENT_ENTRY_CLIENT_REACT }, formats: ["es"] },
          outDir: resolve(process.cwd(), "build", config.app.name, "client")
        }
      },
      [VITE_ENVIRONMENTS.SSR]: {
        build: {
          ssr: true,
          lib: { entry: { ssr: PACKAGE_ENTRIES.FLUXORA_CLIENT_ENTRY_CLIENT_REACT }, formats: ["es"] },
          outDir: resolve(process.cwd(), "build", config.app.name, "ssr")
        }
      }
    },
    builder: {
      async buildApp(builder) {
        logger.info(`Building (${config.app.name})`);
        const startTime = performance.now();

        await builder.build(builder.environments[VITE_ENVIRONMENTS.SERVER]);
        await builder.build(builder.environments[VITE_ENVIRONMENTS.CLIENT]);
        await builder.build(builder.environments[VITE_ENVIRONMENTS.SSR]);

        const diff = (performance.now() - startTime).toFixed(2);
        logger.info(`Application ${config.app.name} built in ${diff}ms`);
      }
    }
  };

  if (viteConfig.mode === "development" && config.app.host.devWsPort) {
    viteConfig.server!.ws = undefined;
    viteConfig.server!.hmr = { host: "localhost", path: "hmr", protocol: "ws", port: config.app.host.devWsPort };
  }

  return viteConfig;
};

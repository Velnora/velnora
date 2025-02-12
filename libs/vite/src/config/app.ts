import { resolve } from "node:path";

import type { InlineConfig, PluginOption } from "vite";

import type { App, FluxoraApp } from "@fluxora/types/core";
import { FEDERATION_SHARED_PACKAGES, PACKAGE_ENTRIES, VIRTUAL_ALIAS_ENTRIES, VITE_ENVIRONMENTS } from "@fluxora/utils";
import { projectFs } from "@fluxora/utils/node";

import { logger } from "../utils/logger";
import { getCommonConfiguration } from "./common-configuration";

export const getAppConfiguration = async (app: App): Promise<InlineConfig> => {
  const port = +new URL(app.host, "http://localhost").port;

  const viteConfig = await getCommonConfiguration(app, {
    server: { port, host: true, ws: false, watch: {}, middlewareMode: true },
    cacheDir: projectFs.cache.app(app.name).vite,
    environments: {
      [VITE_ENVIRONMENTS.SERVER]: {
        build: {
          ssr: true
          //       lib: {
          //         entry: { server: PACKAGE_ENTRIES.FLUXORA_SERVER_ENTRY, ssr: VIRTUAL_ALIAS_ENTRIES.SSR_ENTRY },
          //         formats: ["es"]
          //       },
          //       outDir: resolve(config.outDirRoot, app.name, VITE_ENVIRONMENTS.SERVER)
        },
        consumer: "server"
      },
      [VITE_ENVIRONMENTS.CLIENT]: {
        build: {
          //       ssr: !config.isHostApp(),
          lib: {
            entry: {
              "index.html": "index.html"
              // [config.remoteEntry.entryPath.replace(/^\//, "").slice(0, -3)]: config.remoteEntry.entryPath
            },
            formats: ["es"]
          }
          //       outDir: resolve(config.outDirRoot, app.name, VITE_ENVIRONMENTS.CLIENT),
          // rollupOptions: {
          //   output: {
          //     entryFileNames(chunkInfo) {
          //       if (chunkInfo.name.endsWith(".html")) return chunkInfo.name.replace(/.html$/, ".js");
          //       return chunkInfo.name + ".js";
          //     },
          //     chunkFileNames(chunk) {
          //       return chunk.name.startsWith(FEDERATION_SHARED_PACKAGES)
          //         ? `shared/${chunk.name.slice(FEDERATION_SHARED_PACKAGES.length)}.js`
          //         : `chunks/[hash].js`;
          //     }
          //   }
          // }
        },
        consumer: "client"
      }
    },
    builder: {
      async buildApp(builder) {
        logger.info(`Building (${app.name})`);
        const startTime = performance.now();

        await builder.build(builder.environments[VITE_ENVIRONMENTS.SERVER]);
        await builder.build(builder.environments[VITE_ENVIRONMENTS.CLIENT]);

        const diff = (performance.now() - startTime).toFixed(2);
        logger.info(`Application ${app.name} built in ${diff}ms`);
      }
    }
  });

  if (viteConfig.mode === "development" && app.devWsPort) {
    viteConfig.server!.ws = undefined;
    viteConfig.server!.hmr = { host: "localhost", path: "hmr", protocol: "ws", port: app.devWsPort };
  }

  return viteConfig;
};

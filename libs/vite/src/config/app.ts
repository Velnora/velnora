import { resolve } from "node:path";

import type { InlineConfig } from "vite";

import type { FluxoraApp } from "@fluxora/types/core";
import { FEDERATION_SHARED_PACKAGES, PACKAGE_ENTRIES, VIRTUAL_ALIAS_ENTRIES, VITE_ENVIRONMENTS } from "@fluxora/utils";

import { logger } from "../utils/logger";
import { getConfiguration } from "./configuration";

export const getAppConfiguration = async (): Promise<InlineConfig> => {
  // const port = +new URL(config.app.host.host, "http://localhost").port;

  const viteConfig = await getConfiguration({
    // server: { port, host: true, ws: false, watch: {} },
    // cacheDir: resolve(config.fluxoraRoot, "apps", config.app.name, ".vite"),
    // environments: {
    //   [VITE_ENVIRONMENTS.SERVER]: {
    //     build: {
    //       ssr: true,
    //       lib: {
    //         entry: { server: PACKAGE_ENTRIES.FLUXORA_SERVER_ENTRY, ssr: VIRTUAL_ALIAS_ENTRIES.SSR_ENTRY },
    //         formats: ["es"]
    //       },
    //       outDir: resolve(config.outDirRoot, config.app.name, VITE_ENVIRONMENTS.SERVER)
    //     },
    //     consumer: "server"
    //   },
    //   [VITE_ENVIRONMENTS.CLIENT]: {
    //     build: {
    //       ssr: !config.isHostApp(),
    //       lib: {
    //         entry: {
    //           "index.html": "index.html",
    //           [config.remoteEntry.entryPath.replace(/^\//, "").slice(0, -3)]: config.remoteEntry.entryPath
    //         },
    //         formats: ["es"]
    //       },
    //       outDir: resolve(config.outDirRoot, config.app.name, VITE_ENVIRONMENTS.CLIENT),
    //       rollupOptions: {
    //         output: {
    //           entryFileNames(chunkInfo) {
    //             if (chunkInfo.name.endsWith(".html")) return chunkInfo.name.replace(/.html$/, ".js");
    //             return chunkInfo.name + ".js";
    //           },
    //           chunkFileNames(chunk) {
    //             return chunk.name.startsWith(FEDERATION_SHARED_PACKAGES)
    //               ? `shared/${chunk.name.slice(FEDERATION_SHARED_PACKAGES.length)}.js`
    //               : `chunks/[hash].js`;
    //           }
    //         }
    //       }
    //     },
    //     consumer: "client"
    //   }
    // },
    // builder: {
    //   async buildApp(builder) {
    //     logger.info(`Building (${config.app.name})`);
    //     const startTime = performance.now();
    //
    //     await builder.build(builder.environments[VITE_ENVIRONMENTS.SERVER]);
    //     await builder.build(builder.environments[VITE_ENVIRONMENTS.CLIENT]);
    //
    //     const diff = (performance.now() - startTime).toFixed(2);
    //     logger.info(`Application ${config.app.name} built in ${diff}ms`);
    //   }
    // },
    worker: {
      rollupOptions: {},
      format: "es",
      plugins() {
        return [];
      }
    }
  });

  // if (viteConfig.mode === "development" && config.app.host.devWsPort) {
  //   viteConfig.server!.ws = undefined;
  //   viteConfig.server!.hmr = { host: "localhost", path: "hmr", protocol: "ws", port: config.app.host.devWsPort };
  // }

  return viteConfig;
};

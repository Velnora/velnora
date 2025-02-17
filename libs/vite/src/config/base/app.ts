import { resolve } from "node:path";

import chalk from "chalk";
import type { InlineConfig } from "vite";

import type { App } from "@fluxora/types/core";
import {
  CLIENT_ENTRY_FILE_EXTENSIONS,
  FEDERATION_SHARED_PACKAGES,
  PACKAGE_ENTRIES,
  VIRTUAL_ALIAS_ENTRIES,
  VITE_ENVIRONMENTS
} from "@fluxora/utils";
import { projectFs } from "@fluxora/utils/node";

import { findEntryFile } from "../../utils/find-entry-file";
import { logger } from "../../utils/logger";
import { getCommonConfiguration } from "../common-configuration";

export const getAppConfiguration = async (app: App, compile = false): Promise<InlineConfig> => {
  const port = +new URL(app.host, "http://localhost").port;

  const viteConfig = await getCommonConfiguration(app, {
    server: { port, host: true, ws: false, watch: {}, middlewareMode: true },
    cacheDir: projectFs.cache.app(app.name).vite,
    build: {
      rollupOptions: {
        output: {
          entryFileNames(chunkInfo) {
            if (chunkInfo.name.endsWith(".html")) return chunkInfo.name.replace(/.html$/, ".js");
            return chunkInfo.name + ".js";
          },
          chunkFileNames(chunk) {
            return chunk.name.startsWith(FEDERATION_SHARED_PACKAGES)
              ? `shared/${chunk.name.slice(FEDERATION_SHARED_PACKAGES.length)}.js`
              : `chunks/[hash].js`;
          }
        }
      }
    },
    environments: {
      [VITE_ENVIRONMENTS.SERVER]: {
        build: {
          ssr: true,
          lib: {
            entry: compile
              ? { app: findEntryFile(projectFs.app(app.name).$raw, "entry-client", CLIENT_ENTRY_FILE_EXTENSIONS) }
              : { server: PACKAGE_ENTRIES.SERVER_ENTRY, ssr: VIRTUAL_ALIAS_ENTRIES.SSR_ENTRY },
            formats: ["es"]
          },
          outDir: compile
            ? resolve(process.cwd(), ".fluxora/apps", app.name, "build")
            : resolve(process.cwd(), "build/apps", app.name, VITE_ENVIRONMENTS.SERVER)
        },
        consumer: "server"
      },
      [VITE_ENVIRONMENTS.CLIENT]: {
        build: {
          ssr: compile,
          lib: {
            entry: compile
              ? { client: findEntryFile(projectFs.app(app.name).$raw, "entry-client", CLIENT_ENTRY_FILE_EXTENSIONS) }
              : {
                  "index.html": "index.html",
                  [app.remoteEntry.entryPath.replace(/^\//, "").slice(0, -3)]: app.remoteEntry.entryPath
                },
            formats: ["es"]
          },
          outDir: compile
            ? resolve(process.cwd(), ".fluxora/apps", app.name, "build", VITE_ENVIRONMENTS.CLIENT)
            : resolve(process.cwd(), "build/apps", app.name, VITE_ENVIRONMENTS.CLIENT)
        },
        consumer: "client"
      }
    },
    builder: {
      async buildApp(builder) {
        const startTime = performance.now();
        !compile && (await builder.build(builder.environments[VITE_ENVIRONMENTS.CLIENT]));
        await builder.build(builder.environments[VITE_ENVIRONMENTS.SERVER]);

        const diff = (performance.now() - startTime).toFixed(2);
        logger.info(chalk.green(`Application "${app.name}" successfully compiled in ${diff}ms`));
      }
    }
  });

  if (viteConfig.mode === "development" && app.devWsPort) {
    viteConfig.server!.ws = undefined;
    viteConfig.server!.hmr = { host: "localhost", path: "hmr", protocol: "ws", port: app.devWsPort };
  }

  return viteConfig;
};

import { Plugin, type PluginOption, defineConfig } from "vite";

import type { INestApplication } from "@nestjs/common";

import { PACKAGE_ENTRIES } from "../../const";
import type { FluxoraAppConfig } from "../../types";
import { logger } from "../../utils/logger";

/**
 * Common NestJS plugin for both development and production.
 */
const nestCommonPlugin = (_appConfig: FluxoraAppConfig): Plugin => {
  return {
    name: "fluxora:micro-app-plugins:server-plugins:nest-app:common",
    enforce: "pre",

    config() {
      return defineConfig({
        build: {
          lib: { entry: { server: PACKAGE_ENTRIES.FLUXORA_SERVER_ENTRY }, formats: ["es"] }
        }
      });
    }
  };
};

/**
 * Development-specific NestJS plugin.
 */
const nestDevPlugin = (appConfig: FluxoraAppConfig): Plugin => {
  return {
    name: "fluxora:micro-app-plugins:server-plugins:nest-app:dev",
    apply: "serve",

    async configureServer(server) {
      try {
        const { main } = (await server.ssrLoadModule(PACKAGE_ENTRIES.FLUXORA_SERVER_ENTRY)) as {
          main: () => Promise<INestApplication>;
        };
        const app = await main();
        const nestMiddleware = app.getHttpAdapter().getInstance();

        server.middlewares.use((req, res, next) => {
          if (req.url?.startsWith(`/api/v1/${appConfig.app.name}`)) {
            return nestMiddleware(req, res);
          }
          next();
        });
      } catch (error) {
        logger.error("Error configuring NestJS server:", error);
      }
    }
  };
};

/**
 * Production-specific NestJS plugin.
 */
const nestProdPlugin = (_appConfig: FluxoraAppConfig): Plugin => {
  return {
    name: "fluxora:micro-app-plugins:server-plugins:nest-app:prod",
    apply: "build"
  };
};

/**
 * Aggregates the common, development, and production plugins.
 */
export const microNestAppPlugin = (appConfig: FluxoraAppConfig): PluginOption => {
  return [nestCommonPlugin(appConfig), nestDevPlugin(appConfig), nestProdPlugin(appConfig)];
};

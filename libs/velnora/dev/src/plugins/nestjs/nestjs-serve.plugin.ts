import { existsSync } from "node:fs";

import type { Plugin } from "vite";

import { Module, type Type } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { adapterRegistry } from "@velnora/adapter-loader";
import { RegisteredApp, appCtx } from "@velnora/runtime";
import type { WithDefault } from "@velnora/types";
import { capitalize } from "@velnora/utils";
import { SERVER_ENTRY_FILE_EXTENSIONS, findFile } from "@velnora/utils/node";

export const nestjsServePlugin = (app: RegisteredApp): Plugin => {
  const adapterContext = adapterRegistry.use(app.config.adapter, app);

  return {
    name: "velnora:plugin:nestjs",
    enforce: "pre",
    apply: "serve",

    async configureServer(server) {
      const modulePath = findFile(app.root, `server/${app.name}.module`, SERVER_ENTRY_FILE_EXTENSIONS);

      const imports: Type[] = [];
      if (modulePath && existsSync(modulePath)) {
        const module = await appCtx.vite
          .getSsr(app.name, server)
          .runner.import<WithDefault<Type, Record<string, Type>>>(modulePath);

        const NestClassModule = module[`${capitalize(app.name)}Module`] || module.AppModule || module.default;
        if (!NestClassModule) {
          // ToDo: Handle Error
          throw new Error(
            `Module ${modulePath} does not export a class named ${capitalize(app.name)}Module or AppModule`
          );
        }
        Object.defineProperty(NestClassModule, "name", { value: `${capitalize(app.name)}Module` });
        imports.push(NestClassModule);
      }

      @Module({ imports })
      class AppModule {}
      const prefix = "/api/v1";
      const nestApp = await NestFactory.create(AppModule, adapterContext.nestjs.adapter());
      nestApp.setGlobalPrefix(prefix);
      await nestApp.init();
      const nestAppServer = nestApp.getHttpAdapter().getInstance();
      server.middlewares.use(prefix, (req, res, next) => {
        req.url = prefix + req.url;
        nestAppServer(req, res, next);
      });
    }
  };
};

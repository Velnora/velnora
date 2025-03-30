import http from "node:http";

import { type UserConfig, createServer } from "vite";

import type { CreateServerOptions } from "@fluxora/types";
import { PROJECT_CWD, VIRTUAL_ENTRIES, VITE_ENVIRONMENTS, appCtx, tsconfigPathsPlugin } from "@fluxora/utils";
import { Module, type Type } from "@nestjs/common";

import { resolveLibPlugin } from "../plugins/libs/resolve-lib.plugin";
import { resolvePagesPlugin } from "../plugins/pages/resolve-pages.plugin";
import { resolveTemplatePlugin } from "../plugins/template/resolve-template.plugin";

export const createDevServer = async (options?: CreateServerOptions) => {
  await appCtx.resolveUserConfig();
  await appCtx.init();
  await appCtx.projectStructure.apps.resolveFrameworkAndAdapterConfiguration();
  appCtx.checks();

  const port = options?.port || appCtx.userConfig.server?.port || 3000;
  const viteConfig = {
    root: process.cwd(),
    define: { __DEV__ },
    plugins: [
      appCtx.projectStructure.apps.framework?.plugins || [],
      [resolveTemplatePlugin(), resolvePagesPlugin(), resolveLibPlugin()],
      tsconfigPathsPlugin()
    ],
    server: {
      port,
      fs: { allow: [PROJECT_CWD] },
      proxy: appCtx.userConfig.server?.proxy,
      hmr: { port: port + 1 },
      host: true,
      middlewareMode: true
    },
    environments: {
      [VITE_ENVIRONMENTS.SERVER]: { consumer: "server" },
      [VITE_ENVIRONMENTS.CLIENT]: { consumer: "client" }
    },
    appType: "custom",
    clearScreen: false
  } satisfies UserConfig;

  const vite = await createServer(viteConfig);
  appCtx.vite.server = vite;

  const appsPromise = Array.from(appCtx.projectStructure.apps.apps).map(async app => {
    const appPath = appCtx.projectStructure.apps.getAppByPath(app);
    if (!appPath) return Promise.resolve();
    return appCtx.vite.loadModuleSilent<{ default: Type }>(VIRTUAL_ENTRIES.APP_SERVER(app));
  });
  const imports = (await Array.fromAsync(appsPromise)).filter(m => !!m && "default" in m).map(m => m.default);

  @Module({ imports })
  class AppModule {}

  const httpAdapter = await appCtx.projectStructure.apps.adapter!.boostrap({ AppModule, vite });

  httpAdapter.use(vite.middlewares).use("*", async (req, res) => {
    const html = await vite.transformIndexHtml(req.originalUrl, "", req.originalUrl);
    const app = appCtx.projectStructure.apps.getAppByPath(req.url);
    if (app) appCtx.projectStructure.apps.setAppLoaded(app);
    res.end(html);
  });

  const httpServer = http.createServer(httpAdapter.handler);
  httpServer.listen(vite.config.server.port, () => {});
  httpServer.on("error", _err => {
    // ToDo: test error when port is already in use
    // console.log(err);
    // if (err.code === "EADDRINUSE") {
    //   console.error(`Port ${vite.config.server.port} is already in use`);
    // }
  });

  httpServer.on("listening", () => {
    console.log(`🚀 Server running on HTTP/1.1 at http://localhost:${vite.config.server.port}`);
  });
};

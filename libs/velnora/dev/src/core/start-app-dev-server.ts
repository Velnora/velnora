import { resolve } from "node:path";

import { createServer } from "vite";
import inspect from "vite-plugin-inspect";
import tsconfigPaths from "vite-tsconfig-paths";

import { adapterRegistry } from "@velnora/adapter-loader";
import { environmentRegistry } from "@velnora/environment-loader";
import { frameworkRegistry } from "@velnora/framework-loader";
import { resolveRoutes } from "@velnora/router/node";
import { appCtx } from "@velnora/runtime";
import type { RegisteredApp } from "@velnora/types";
import { APP_CONTAINER, VIRTUAL_ENTRIES } from "@velnora/utils";
import { PROJECT_CWD } from "@velnora/utils/node";

import { nestjsPlugin } from "../plugins/nestjs";
import { swcPlugin } from "../plugins/swc.plugin";
import { velnoraAppPlugin } from "../plugins/velnora-app.plugin";
import type { Inject } from "../types/inject";
import { injectHtmlTags } from "../utils/inject-html-tags";
import { logger } from "../utils/logger";

declare const __DEV__: boolean;

export const startAppDevServer = async (app: RegisteredApp) => {
  const appModule = appCtx.projectStructure.apps.getModule(app.name);
  const appTemplate = appCtx.projectStructure.template.getModule(appModule.config.template);

  await Promise.all([
    frameworkRegistry.registerSilent(app.config.framework),
    frameworkRegistry.registerSilent(appTemplate.config.framework),
    adapterRegistry.registerSilent(app.config.adapter),
    environmentRegistry.registerSilent(appModule.config.environment.runtime)
  ]);

  const [environmentContext, appFrameworkContext, adapterContext] = [
    environmentRegistry.use(appModule.config.environment.runtime, app),
    frameworkRegistry.use(app.config.framework, app),
    adapterRegistry.use(app.config.adapter, app)
  ];
  let templateFrameworkContext = appFrameworkContext;

  if (app.config.framework !== appTemplate.config.framework) {
    templateFrameworkContext = frameworkRegistry.use(appTemplate.config.framework, app);
  }

  environmentContext.checkEnvironment(appModule);

  const server = environmentContext.createServer((req, res) => adapterContext.server.instance(req, res));

  const appFrameworkPlugins = appFrameworkContext.plugins;
  const templateFrameworkPlugins = templateFrameworkContext.plugins;
  const adapterPlugins = adapterContext.vite.plugins;
  const plugins = new Set([
    velnoraAppPlugin(appModule),
    nestjsPlugin(appModule),
    app.config.framework !== "react" && swcPlugin(),
    __DEV__ && tsconfigPaths({ root: PROJECT_CWD, loose: true }),
    process.env.NODE_ENV === "development" && inspect(),
    ...(appFrameworkPlugins || []),
    ...(templateFrameworkPlugins || []),
    ...(adapterPlugins || [])
  ]);

  const vite = await createServer({
    root: process.cwd(),
    mode: process.env.NODE_ENV || "production",
    plugins: Array.from(plugins),
    esbuild: false,
    server: {
      middlewareMode: true,
      hmr: { server },
      host: "0.0.0.0",
      port: await appCtx.server.nextAvailablePort()
    },
    cacheDir: resolve(process.cwd(), appCtx.cache.root, "apps", app.name, ".vite"),
    clearScreen: false,
    logLevel: "silent",
    appType: "custom"
  });
  appCtx.vite.setServer(appModule.name, vite);

  adapterContext.server.use(vite.middlewares);
  adapterContext.server.use(async (req, res) => {
    const url = new URL(req.url!, `http://${req.headers.host}`);
    const tags: Inject[] = [
      {
        html: await vite.transformIndexHtml(url.pathname, ""),
        injectTo: "head-prepend"
      },
      {
        tag: "script",
        attrs: { type: "module", src: VIRTUAL_ENTRIES.APP_CLIENT_ENTRY(app.name) },
        injectTo: "body-prepend"
      }
    ];
    if (!appModule.config.ssr) tags.push({ tag: "div", attrs: { id: APP_CONTAINER }, injectTo: "body" });

    const routeResolver = await resolveRoutes(appModule);
    const renderer = await frameworkRegistry.getSSRRenderer(appModule, appTemplate.config.framework);
    const transformStream = injectHtmlTags(tags);

    try {
      const route = routeResolver.getWithFallback(url.pathname, "/");

      const htmlStream = await renderer(
        frameworkRegistry.getSSRRenderContext({ app: appModule, template: appTemplate, route })
      );

      htmlStream.pipe(transformStream).pipe(res);
    } catch (e) {
      res.writeHead(404, { "Content-Type": "text/html" });
      res.end("Not Found");
      return;
    }
  });

  const listenPromise = Promise.withResolvers<void>();
  server.listen(vite.config.server.port, () => {
    logger.success(`Server (${app.name}) started at http://localhost:${vite.config.server.port}`);
    listenPromise.resolve();
  });
  await listenPromise.promise;
};

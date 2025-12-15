import type { ClientRoute } from "velnora/router";

import { getModuleString } from "@velnora/devkit/node";
import { collectLayoutsForPage, fileToRoutePath } from "@velnora/router";
import { type VelnoraContext, ssrTargetMode } from "@velnora/types";

import pkg from "../../../package.json";
import { capitalize } from "../utils/capitalize";

export const setupAppSsr = (ctx: VelnoraContext) => {
  const pageFiles = ctx.fs.glob("app/**/page.{js,ts,jsx,tsx}");

  if (pageFiles.length === 0) {
    ctx.logger.error('React (SSR) mode enabled but no "app/**/page.{js,ts,jsx,tsx}" files found. Skipping.');
    return;
  }

  const routes = pageFiles.map<ClientRoute>(file => {
    const path = fileToRoutePath(file);
    const layouts = collectLayoutsForPage(file, ctx.fs, ["js", "ts", "jsx", "tsx"]);

    const pageSections = file.split("/").slice(1, -1);
    const pageName = pageSections.length === 0 ? [] : [capitalize(pageSections.at(-1)!)];

    const module = ctx.vite.virtual(
      `react/page${path === "/" ? "" : path}/page`,
      getModuleString(ctx.fs.resolve(file), pageName, "Page")
    );

    const layoutModules = layouts.map(layoutPath =>
      ctx.vite.virtual(
        `react/${layoutPath.slice(ctx.fs.root.length + 1).replace(/\.[^/.]+$/, "")}`,
        getModuleString(ctx.fs.resolve(layoutPath), "Layout")
      )
    );

    return { path, route: { module, layouts: layoutModules } };
  });

  const clientRoutesVid = ctx.vite.virtual(`react/routes`, `export default ${JSON.stringify(routes)};`);

  const clientEnvId = ctx.vite.addClientEnvironment();
  const serverEnvId = ctx.vite.addSsrEnvironment();

  ctx.vite.entryClient(
    `
import { createRouter } from "velnora/router";
import { appConfig } from "${ctx.vite.virtualAppConfig}";
import routes from "${clientRoutesVid}";
import { hydrateSsrApp } from "${pkg.name}/client";

const router = createRouter(appConfig);
hydrateSsrApp({ router, routes });
`
  );

  ctx.vite.entrySsr(`
    import { createReactSsrHandler } from "${pkg.name}/server";
    export default createReactSsrHandler({ mode: "${ssrTargetMode.APP_DIR}", routes: ${JSON.stringify(routes)} });
  `);

  ctx.router.registerFrontend({
    renderMode: "ssr",
    entry: ctx.vite.entryClient(),
    environment: clientEnvId,
    ssr: { entry: ctx.vite.entrySsr(), environment: serverEnvId, mode: ssrTargetMode.APP_DIR }
  });
};

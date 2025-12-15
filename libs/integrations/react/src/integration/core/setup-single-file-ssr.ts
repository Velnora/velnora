import type { ClientRoute } from "velnora/router";

import { type VelnoraContext, ssrTargetMode } from "@velnora/types";

import pkg from "../../../package.json";
import { prepareSingleFileSetup } from "../helper/prepare-single-file-setup";

export const setupSingleFileSsr = (ctx: VelnoraContext) => {
  prepareSingleFileSetup(ctx);
  const indexFile = ctx.fs.resolve("index.html");

  const clientRoute: ClientRoute = {
    path: "/",
    route: {
      module: ctx.vite.virtual("react/app-component"),
      layouts: []
    }
  };

  ctx.vite.entryServer(`
import { createReactSsrHandler } from "${pkg.name}/server";
export default createReactSsrHandler({ mode: "${ssrTargetMode.SINGLE_FILE}", routes: [${JSON.stringify(clientRoute)}] });
`);

  const clientEnvId = ctx.vite.addClientEnvironment();
  const serverEnvId = ctx.vite.addSsrEnvironment();

  ctx.router.registerFrontend({
    renderMode: "ssr",
    environment: clientEnvId,
    entry: ctx.vite.entryClient(),
    indexHtmlFile: ctx.fs.exists(indexFile) ? indexFile : undefined,
    ssr: { entry: ctx.vite.entryServer(), environment: serverEnvId, mode: ssrTargetMode.SINGLE_FILE }
  });
};

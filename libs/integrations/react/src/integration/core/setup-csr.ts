import type { VelnoraContext } from "@velnora/schemas";

import { prepareSingleFileSetup } from "../helper/prepare-single-file-setup";

export const setupCsr = (ctx: VelnoraContext) => {
  prepareSingleFileSetup(ctx);

  const clientEnvId = ctx.vite.addClientEnvironment();
  const indexFile = ctx.fs.resolve("index.html");

  ctx.router.registerFrontend({
    renderMode: "csr",
    environment: clientEnvId,
    entry: ctx.vite.entryClient(),
    indexHtmlFile: ctx.fs.exists(indexFile) ? indexFile : undefined
  });
};

import type { VelnoraContext } from "@velnora/schemas";

import pkg from "../../../package.json";
import { capitalize } from "../utils/capitalize";

export const setupCsr = (ctx: VelnoraContext) => {
  if (!ctx.fs.exists("app.{js,ts,jsx,tsx}")) {
    ctx.logger.error(
      "No entry file found for React app in CSR mode. Expected app.{js,ts,jsx,tsx}. Skipping React (client) integration."
    );
    return;
  }

  const entryFiles = ctx.fs.glob("app.{js,ts,jsx,tsx}");
  if (entryFiles.length === 0) {
    ctx.logger.error("Could not find entry file for React app. Skipping React (client) integration.");
    return;
  }

  if (entryFiles.length > 1) {
    ctx.logger.warn("Multiple entry files found for React app. Using the first found.");
  }

  const modulePath = ctx.fs.resolve(entryFiles[0]!);
  const appFile = ctx.vite.virtual(
    "react/app",
    `
import { getModule } from "@velnora/devkit";
import * as __module from "${modulePath}";

export default getModule(__module, ["${capitalize(ctx.app.name)}", "App", "default"]);
`
  );

  const clientEntryFile = ctx.vite.entryClient(
    `
import App from "${appFile}";
import { mount } from "${pkg.name}/client";

mount(<App />, { mode: "csr", selector: "#root" });
`,
    { extension: "tsx" }
  );

  const clientEnvId = ctx.vite.addEnvironment("client");
  const indexFile = ctx.fs.resolve("index.html");

  ctx.router.registerFrontend({
    renderMode: "csr",
    environment: clientEnvId,
    entry: clientEntryFile,
    indexHtmlFile: ctx.fs.exists(indexFile) ? indexFile : undefined
  });
};

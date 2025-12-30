import { getModuleString } from "@velnora/devkit";
import type { VelnoraContext } from "@velnora/types";

import pkg from "../../../package.json";
import { capitalize } from "../utils/capitalize";

export const prepareSingleFileSetup = (ctx: VelnoraContext) => {
  if (!ctx.fs.exists("app.{js,ts,jsx,tsx}")) {
    ctx.logger.error(
      "No entry file found for React app in CSR mode. Expected app.{js,ts,jsx,tsx}. Skipping React (client) integration."
    );
    return;
  }

  const entryFiles = ctx.fs.glob("app.{js,ts,jsx,tsx}", { absolute: true });
  if (entryFiles.length === 0) {
    ctx.logger.error("Could not find entry file for React app. Skipping React (client) integration.");
    return;
  }

  if (entryFiles.length > 1) {
    ctx.logger.warn("Multiple entry files found for React app. Using the first found.");
  }

  const entrypoint = entryFiles[0]!;

  const singleFileAppResolver = ctx.vite.virtual(
    "react/app",
    getModuleString(entrypoint, [`${capitalize(ctx.app.basename)}App`, capitalize(ctx.app.basename), "App"])
  );

  const reactComponent = ctx.vite.virtual(
    "react/app-component",
    `
import { StrictMode } from "react";
import App from "${singleFileAppResolver}";

export default (
  <StrictMode>
    <App />
  </StrictMode>
);
`,
    { extension: "tsx" }
  );

  return ctx.vite.entryClient(
    `
import app from "${reactComponent}";
import { mount } from "${pkg.name}/client";

mount(app, { mode: "${ctx.app.config.integrations.react?.mode || "csr"}", selector: "#root" });
`
  );
};

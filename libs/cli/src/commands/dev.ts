import { createServer } from "@fluxora/core";

import { rootPackageJsonValidator } from "../validators/root-package-json.validator";
import { rootTsconfigJsonValidator } from "../validators/root-tsconfig-json.validator";
import { defineCommand } from "./index";

export const dev = defineCommand("dev", "Starting the development environment")
  .option("auto", { type: "boolean", defaultValue: false, alias: "a", description: "Auto-configure the environment" })
  .option("no-validate", {
    type: "boolean",
    defaultValue: false,
    alias: "n",
    description: "Skip validations of the environment"
  })
  .execute(async args => {
    await rootPackageJsonValidator(args);
    await rootTsconfigJsonValidator(args);

    const client = await createServer({ type: "client", env: "development", server: { port: 3000 } });
    await client.serve();

    const server = await createServer({ type: "server", env: "development", server: { port: 5000 } });
    await server.serve();
  });

export const devRunApp = defineCommand("dev:app", "Starting the development environment for a specific app").execute(
  // @ts-ignore
  async args => {}
);

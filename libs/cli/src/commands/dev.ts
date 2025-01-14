import { createServer } from "@fluxora/core";

import { defineCommand } from "./index";

export const dev = defineCommand("dev", "Starting the development environment")
  .option("port", { type: "number", defaultValue: 3000, alias: "p", description: "Port to run the server on" })
  .execute(async args => {
    const previousEnv = process.env.NODE_ENV;
    if (!previousEnv) {
      process.env.NODE_ENV = "development";
    } else if (previousEnv !== "development") {
      throw new Error(`Cannot run development server in a other environments. Given: ${previousEnv}`);
    }
    await createServer({ port: args.port });
  });

import { createServer } from "@fluxora/core";

import { defineCommand } from "./index";

export const dev = defineCommand("dev", "Starting the development environment")
  .option("port", { type: "number", defaultValue: 3000, alias: "p", description: "Port to run the server on" })
  .execute(async args => {
    await createServer({ env: "development", server: { port: args.port } });
  });

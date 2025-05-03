import { defineCommand } from "@velnora/cli-helper";
import { dev as devCommand } from "@velnora/dev";

export const dev = defineCommand("dev", "Starting the development environment")
  .option("port", { type: "number", default: 3000, alias: "p", description: "Port to run the server on" })
  .execute(async _args => {
    await devCommand();
  });

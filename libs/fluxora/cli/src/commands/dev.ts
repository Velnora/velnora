import { type InferArgs, defineCommand } from "@fluxora/cli-helper";
import { dev as fluxoraDev } from "@fluxora/dev";

export const dev = defineCommand("dev", "Starting the development environment")
  .option("port", { type: "number", default: 3000, alias: "p", description: "Port to run the server on" })
  .execute(async _args => {
    await fluxoraDev();
  });

export type DevCommand = InferArgs<typeof dev>;

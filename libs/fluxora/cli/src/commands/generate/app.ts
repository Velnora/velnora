import { type InferArgs, defineCommand } from "@fluxora/cli-helper";
import { generateApp } from "@fluxora/generator";

export const app = defineCommand("app", "Generate a new Fluxora app")
  .positional("name", "The root directory of the app", { required: true })
  .option("type", { type: "union", alias: "t", values: ["client", "server"] })
  .option("pkg-name", { type: "string", alias: "n", description: "The package name of the app" })
  .execute(generateApp);

export type AppCommandOptions = InferArgs<typeof app>;

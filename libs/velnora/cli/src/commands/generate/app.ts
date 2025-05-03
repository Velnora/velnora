import { type InferArgs, defineCommand } from "@velnora/cli-helper";
import { generateApp } from "@velnora/generator";

export const app = defineCommand("app", "Generate a new Velnora app")
  .positional("name", "The root directory of the app", { required: true })
  .option("type", { type: "union", alias: "t", values: ["client", "server"] })
  .option("pkg-name", { type: "string", alias: "n", description: "The package name of the app" })
  .execute(generateApp);

export type AppCommandOptions = InferArgs<typeof app>;

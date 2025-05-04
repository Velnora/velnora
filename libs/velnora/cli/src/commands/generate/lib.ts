import { type InferArgs, defineCommand } from "@velnora/cli-helper";
import { generateLib } from "@velnora/generator";

export const lib = defineCommand("lib", "Generate a new shared library")
  .positional("name", "The root directory of the app", { required: true })
  .option("pkg-name", { type: "string", alias: "n", description: "The package name of the app" })
  .option("jsx", { type: "boolean", description: "Enable JSX support", default: false })
  .execute(generateLib);

export type LibCommandOptions = InferArgs<typeof lib>;

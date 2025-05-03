import { defineCommand } from "@velnora/cli-helper";
import { build as buildCommand } from "@velnora/dev";

export const build = defineCommand("build", "Build the app")
  .option("output", { type: "string", default: "dist", alias: "o", description: "Output directory" })
  .execute(async _args => {
    await buildCommand();
  });

import { type InferArgs, defineCommand } from "@fluxora/cli-helper";
import { build as fluxoraBuild } from "@fluxora/dev";

export const build = defineCommand("build", "Build the app")
  .option("output", { type: "string", default: "dist", alias: "o", description: "Output directory" })
  .execute(async _args => {
    await fluxoraBuild();
  });

export type BuildCommand = InferArgs<typeof build>;

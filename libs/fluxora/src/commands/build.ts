import { defineCommand } from "@fluxora/cli-helper";

import { build as fluxoraBuild } from "../core/build";

export const build = defineCommand("build", "Build the app")
  .option("output", { type: "string", defaultValue: "dist", alias: "o", description: "Output directory" })
  .execute(async () => {
    await fluxoraBuild();
  });

import { build as fluxoraBuild } from "@fluxora/core";

import { defineCommand } from ".";

export const build = defineCommand("build", "Build the app")
  .option("o", { type: "string", defaultValue: "dist", alias: "output", description: "Output directory" })
  .execute(async () => {
    await fluxoraBuild();
  });

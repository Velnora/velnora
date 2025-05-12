import { defineCommand } from "@velnora/cli-helper";

export const generate = defineCommand("generate", "Generates files based on templates").children(
  import("./app"),
  import("./lib"),
  import("./project")
);

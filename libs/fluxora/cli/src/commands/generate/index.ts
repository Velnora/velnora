import { defineCommand } from "@fluxora/cli-helper";

export const generate = defineCommand("generate", "Generates files based on templates").children(import("./app"));

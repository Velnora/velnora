import type { CommandsType } from "@fluxora/cli-helper";

export const commands: CommandsType = [import("./dev"), import("./build")];

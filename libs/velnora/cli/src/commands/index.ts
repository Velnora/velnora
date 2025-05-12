import type { CommandsType } from "@velnora/cli-helper";

export const commands: CommandsType = [
  import("./dev"),
  import("./build"),
  import("./generate"),
  import("./new").then(m => ({ new: m.newCommand }))
];

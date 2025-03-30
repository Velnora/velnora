import { Commands } from "@fluxora/cli-helper";

import { version } from "../package.json" with { type: "json" };
import { commands as commandList } from "./commands";
import { cliLogger } from "./utils/loggers";

export const cli = async () => {
  cliLogger.debug("Initializing CLI...");
  const commands = new Commands(commandList);
  await commands.executeCommands(version);
};

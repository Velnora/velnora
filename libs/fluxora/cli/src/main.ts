import { Commands } from "@fluxora/cli-helper";

import { version } from "../package.json" with { type: "json" };
import { commands as commandList } from "./commands";
import { logger } from "./utils/logger";

export const cli = async () => {
  logger.debug("Initializing CLI...");
  const commands = new Commands(commandList);
  await commands.executeCommands(version);
};

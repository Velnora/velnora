import { commands as commandList } from "./commands/index";
import { Commands } from "./utils/commands";
import { logger } from "./utils/logger";

export const cli = async () => {
  logger.debug("Initializing CLI...");
  const commands = new Commands(commandList);
  await commands.executeCommands();
};

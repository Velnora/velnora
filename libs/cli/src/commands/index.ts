import { Command } from "../utils/command";
import type { CommandsType } from "../utils/commands";
import { logger } from "../utils/logger";

export const defineCommand = (name: string, description?: string) => {
  logger.debug(`Defining command: ${name}`);
  return new Command(name, description);
};

export const commands: CommandsType = [import("./dev")];

import { logger } from "../utils/logger";
import { Command } from "./command";

export const defineCommand = (name: string, description?: string) => {
  logger.debug(`Defining command: ${name}`);
  return new Command(name, description);
};

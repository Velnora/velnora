import { Emojis } from "@velnora/logger";

import { logger } from "../utils/logger";
import { Command } from "./command";

export const defineCommand = (name: string, description?: string) => {
  logger.debug(Emojis.define, `Defining command: ${name} for "${description}"`);
  return new Command(name, description);
};

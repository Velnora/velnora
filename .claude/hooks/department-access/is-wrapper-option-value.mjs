import { commandName } from "./command-name.mjs";
import { COMMAND_WRAPPERS } from "./command-wrappers.mjs";
import { isGitTool } from "./is-git-tool.mjs";

/**
 * Which wrapper options take a value differs per tool (`nice -n 10`, `sudo -u root`, but `sudo -E`), so any
 * option may take the next word, unless that word could be the wrapped command itself.
 */
export const isWrapperOptionValue = word => {
  if (word === undefined || word.startsWith("-")) {
    return false;
  }

  return !isGitTool(word) && !COMMAND_WRAPPERS.has(commandName(word));
};

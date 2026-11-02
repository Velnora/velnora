import { commandName } from "./command-name.mjs";

const GIT_TOOLS = ["git", "gh"];

export const isGitTool = word => {
  return GIT_TOOLS.includes(commandName(word));
};

import { commandName } from "./command-name.mjs";
import { findGitSubcommand } from "./find-git-subcommand.mjs";
import { isGitTool } from "./is-git-tool.mjs";
import { skipCommandPrefixes } from "./skip-command-prefixes.mjs";
import { splitShellWords } from "./split-shell-words.mjs";

const SEGMENT_SEPARATOR = /[;&|()\n`]/;

/**
 * Separators split the command even inside quotes, since `echo "$(git push)"` still runs the git call.
 * `readsArgsFromStdin` marks a call behind `xargs`, whose subcommand may come from standard input.
 */
export const listGitCalls = command => {
  const calls = [];

  for (const segment of command.split(SEGMENT_SEPARATOR)) {
    const words = splitShellWords(segment);
    const { commandIndex, readsArgsFromStdin } = skipCommandPrefixes(words);
    const toolWord = words[commandIndex];
    if (toolWord === undefined || !isGitTool(toolWord)) {
      continue;
    }

    const args = words.slice(commandIndex + 1);
    calls.push({
      tool: commandName(toolWord),
      subcommand: findGitSubcommand(args),
      args,
      readsArgsFromStdin
    });
  }

  return calls;
};

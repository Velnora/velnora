import { listGitCalls } from "./list-git-calls.mjs";

export const AGENT_GIT_SUBCOMMANDS = [
  "add",
  "apply",
  "blame",
  "commit",
  "diff",
  "grep",
  "log",
  "ls-files",
  "mv",
  "rev-parse",
  "rm",
  "show",
  "status"
];

/**
 * Returns the first `git` or `gh` call in a shell command that a sub-agent may not run (e.g. `git push`, `gh`),
 * or null. A role stages, commits and reads history itself; branches, pushes, history rewrites and `gh` stay
 * with the coordinator. An unknown subcommand, an alias included, counts as forbidden, and so does a bare `git` behind
 * `xargs`, since its subcommand would come from standard input.
 */
export const findForbiddenGitCall = command => {
  for (const { tool, subcommand, args, readsArgsFromStdin } of listGitCalls(command)) {
    if (tool === "gh") {
      return "gh";
    }
    if (subcommand === null && readsArgsFromStdin) {
      return "xargs git";
    }
    if (subcommand === null) {
      continue;
    }
    if (!AGENT_GIT_SUBCOMMANDS.includes(subcommand)) {
      return `git ${subcommand}`;
    }
    if (subcommand === "commit" && args.includes("--amend")) {
      return "git commit --amend";
    }
  }

  return null;
};

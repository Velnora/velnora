const OPTIONS_WITH_SEPARATE_VALUE = new Set(["-C", "-c", "--git-dir", "--work-tree", "--namespace"]);

/**
 * Returns the subcommand of a `git` call from its arguments (`push` in `git -C libs/x push`), or null when the
 * call has only options, such as `git --version`.
 */
export const findGitSubcommand = args => {
  for (let index = 0; index < args.length; index++) {
    const arg = args[index];
    if (OPTIONS_WITH_SEPARATE_VALUE.has(arg)) {
      index++;
      continue;
    }
    if (!arg.startsWith("-")) {
      return arg;
    }
  }

  return null;
};

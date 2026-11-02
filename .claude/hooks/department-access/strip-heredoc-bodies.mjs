const HEREDOC_START = /<<(-?)\s*(['"]?)([A-Za-z_][\w-]*)\2/;

/**
 * Removes the bodies of shell heredocs (`<<EOF ... EOF`, `<<-'EOF' ... EOF`), keeping every other line.
 * A heredoc body is text fed to a command, such as a commit message or PR description, so a `.env` or `git`
 * mentioned in it is not a file access or a git call.
 */
export const stripHeredocBodies = command => {
  const keptLines = [];
  let terminator = null;
  let allowsTabIndent = false;

  for (const line of command.split("\n")) {
    if (terminator !== null) {
      const candidate = (allowsTabIndent ? line.replace(/^\t+/, "") : line).replace(/\r$/, "");
      if (candidate === terminator) {
        terminator = null;
      }
      continue;
    }

    keptLines.push(line);
    const heredocStart = line.match(HEREDOC_START);
    if (heredocStart) {
      allowsTabIndent = heredocStart[1] === "-";
      terminator = heredocStart[3];
    }
  }

  return keptLines.join("\n");
};

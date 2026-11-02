const HERE_STRING_START = /@(['"])\s*$/;

/**
 * Removes the bodies of PowerShell here-strings (`@'...'@`, `@"..."@`), keeping every other line.
 * Like a heredoc body, a here-string is text handed to a command, such as a commit message, so a `.env`
 * or `git` mentioned in it is not a file access or a git call. A here-string's opener ends its line and its
 * closer starts one, which is the only form PowerShell accepts.
 */
export const stripPowerShellHereStrings = command => {
  const keptLines = [];
  let closer = null;

  for (const line of command.split("\n")) {
    if (closer !== null) {
      if (line.startsWith(closer)) {
        keptLines.push(line.slice(closer.length));
        closer = null;
      }
      continue;
    }

    keptLines.push(line);
    const hereStringStart = line.replace(/\r$/, "").match(HERE_STRING_START);
    if (hereStringStart) {
      closer = `${hereStringStart[1]}@`;
    }
  }

  return keptLines.join("\n");
};

import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";
import { join } from "node:path";

/** `git ls-files -c` still lists a tracked file deleted from the working tree until the deletion is staged. */
export const listMarkdownFiles = (root: string) => [
  ...new Set(
    execFileSync("git", ["ls-files", "-co", "--exclude-standard", "--", "*.md"], {
      cwd: root,
      encoding: "utf8"
    })
      .split(/\r?\n/)
      .filter(file => file && existsSync(join(root, file)))
  )
];

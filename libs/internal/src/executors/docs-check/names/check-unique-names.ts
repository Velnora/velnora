import { basename } from "node:path";

import type { DocsProblem } from "../docs-problem";
import { REPEATABLE_NAMES } from "./const";

export const checkUniqueNames = (files: string[]) => {
  const names = new Map<string, string[]>();
  for (const file of files) {
    const name = basename(file, ".md");
    names.set(name, [...(names.get(name) ?? []), file]);
  }
  const problems: DocsProblem[] = [];
  for (const [name, paths] of names) {
    const [first] = paths;
    if (first && paths.length > 1 && !REPEATABLE_NAMES.has(name)) {
      problems.push({ file: first, line: 1, message: `Duplicate Markdown name ${name}: ${paths.join(", ")}` });
    }
  }
  return problems;
};

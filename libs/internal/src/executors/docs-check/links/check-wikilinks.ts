import type { DocsProblem } from "../docs-problem";

export const checkWikilinks = (file: string, masked: string, names: Set<string>) => {
  const problems: DocsProblem[] = [];
  for (const [index, line] of masked.split(/\r?\n/).entries()) {
    for (const match of line.matchAll(/\[\[([^\]]+)\]\]/g)) {
      const name = match[1]?.split(/[|#]/)[0] ?? "";
      if (!names.has(name)) {
        problems.push({ file, line: index + 1, message: `Unknown wikilink: ${name}` });
      }
    }
  }
  return problems;
};

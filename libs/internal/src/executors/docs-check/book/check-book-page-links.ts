import { basename } from "node:path";

import type { DocsProblem } from "../docs-problem";
import { readFrontmatterLink } from "../frontmatter/read-frontmatter-link";

export const checkBookPageLinks = (pages: Map<string, string>, names: Map<string, string>) => {
  const problems: DocsProblem[] = [];
  for (const [file, source] of pages) {
    const prev = readFrontmatterLink(source, "prev");
    const next = readFrontmatterLink(source, "next");
    for (const [key, link] of [
      ["prev", prev],
      ["next", next]
    ] as const) {
      if (link.name === undefined) {
        problems.push({ file, line: link.line, message: `Invalid or missing frontmatter ${key}` });
      }
    }
    if (!next.name) {
      continue;
    }
    const destination = names.get(next.name);
    if (!destination) {
      problems.push({ file, line: next.line, message: `Next names no book page: ${next.name}` });
      continue;
    }
    const destinationPrev = readFrontmatterLink(pages.get(destination) ?? "", "prev");
    if (destinationPrev.name !== basename(file, ".md")) {
      problems.push({
        file: destination,
        line: destinationPrev.line,
        message: `Prev must name ${basename(file, ".md")}`
      });
    }
  }
  return problems;
};

import type { DocsProblem } from "../docs-problem";
import { readFrontmatterLink } from "../frontmatter/read-frontmatter-link";
import { FRONT_PAGE } from "./const";

export const walkBookChain = (pages: Map<string, string>, names: Map<string, string>) => {
  const reached = new Set<string>();
  const problems: DocsProblem[] = [];
  let current: string | undefined = FRONT_PAGE;
  while (current && pages.has(current)) {
    reached.add(current);
    const next = readFrontmatterLink(pages.get(current) ?? "", "next");
    const destination = next.name ? names.get(next.name) : undefined;
    if (destination && reached.has(destination)) {
      problems.push({ file: current, line: next.line, message: `Book chain loop to ${destination}` });
      break;
    }
    current = destination;
  }
  return { reached, problems };
};

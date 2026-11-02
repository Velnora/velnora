import { basename } from "node:path";

import { readFrontmatterLink } from "../frontmatter/read-frontmatter-link";
import { checkBookPageLinks } from "./check-book-page-links";
import { FRONT_PAGE } from "./const";
import { walkBookChain } from "./walk-book-chain";

export const checkBookChain = (sources: Map<string, string>) => {
  const pages = new Map([...sources].filter(([file]) => file === FRONT_PAGE || /^docs\/\d{2}-[^/]+\//.test(file)));
  const names = new Map([...pages.keys()].map(file => [basename(file, ".md"), file]));
  const problems = checkBookPageLinks(pages, names);
  const frontPage = pages.get(FRONT_PAGE);
  if (frontPage === undefined) {
    problems.push({ file: FRONT_PAGE, line: 1, message: "Missing book front page" });
    return problems;
  }
  const firstPrev = readFrontmatterLink(frontPage, "prev");
  if (firstPrev.name) {
    problems.push({ file: FRONT_PAGE, line: firstPrev.line, message: "The front page prev must be empty" });
  }
  const chain = walkBookChain(pages, names);
  problems.push(...chain.problems);
  for (const file of pages.keys()) {
    if (!chain.reached.has(file)) {
      problems.push({ file, line: 1, message: "Book page is not reached by the chain" });
    }
  }
  return problems;
};

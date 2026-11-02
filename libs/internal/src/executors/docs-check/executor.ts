import { readFileSync, writeFileSync } from "node:fs";
import { basename, join } from "node:path";

import { logger, type PromiseExecutor } from "@nx/devkit";

import { checkBookChain } from "./book/check-book-chain";
import { maskCode } from "./code/mask-code";
import { checkRelativeLinks } from "./links/check-relative-links";
import { checkWikilinks } from "./links/check-wikilinks";
import { listMarkdownFiles } from "./list-markdown-files";
import { checkUniqueNames } from "./names/check-unique-names";
import type { DocsCheckExecutorSchema } from "./schema";
import { checkTables } from "./tables/check-tables";

export const docsCheckExecutor: PromiseExecutor<DocsCheckExecutorSchema> = (options, context) => {
  const files = listMarkdownFiles(context.root);
  const sources = new Map(files.map(file => [file, readFileSync(join(context.root, file), "utf8")]));
  const docs = files.filter(file => file.startsWith("docs/"));
  const names = new Set(docs.map(file => basename(file, ".md")));
  const problems = [...checkUniqueNames(docs), ...checkBookChain(sources)];
  for (const [file, source] of sources) {
    const masked = maskCode(source);
    problems.push(...checkRelativeLinks(context.root, file, masked), ...checkWikilinks(file, masked, names));
    const tables = checkTables(file, source, options.fix ?? false);
    problems.push(...tables.problems);
    if (tables.fixed.length) {
      writeFileSync(join(context.root, file), tables.content);
      for (const line of tables.fixed) {
        logger.info(`${file}:${line}: Aligned table`);
      }
    }
  }
  for (const problem of problems) {
    logger.error(`${problem.file}:${problem.line}: ${problem.message}`);
  }
  logger.info(`Checked ${files.length} Markdown files; found ${problems.length} problems.`);
  return Promise.resolve({ success: problems.length === 0 });
};

export default docsCheckExecutor;

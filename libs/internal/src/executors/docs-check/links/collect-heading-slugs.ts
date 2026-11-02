import { maskFencedCode } from "../code/mask-fenced-code";
import { findBodyStart } from "../frontmatter/find-body-start";
import { slugifyHeading } from "./slugify-heading";

export const collectHeadingSlugs = (source: string) => {
  const slugs = new Set<string>();
  const lines = maskFencedCode(source).split(/\r?\n/);
  for (let index = findBodyStart(lines); index < lines.length; index++) {
    const line = lines[index] ?? "";
    const heading = line.match(/^ {0,3}#{1,6}\s+(.+?)\s*#*\s*$/)?.[1];
    const setext = index + 1 < lines.length && /^ {0,3}(=+|-+)\s*$/.test(lines[index + 1] ?? "");
    if (!heading && (!setext || !line.trim())) {
      continue;
    }
    const base = slugifyHeading(heading ?? line.trim());
    let slug = base;
    let suffix = 0;
    while (slugs.has(slug)) {
      slug = `${base}-${++suffix}`;
    }
    slugs.add(slug);
  }
  return slugs;
};

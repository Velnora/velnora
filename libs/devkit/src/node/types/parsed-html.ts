import type { InlineTagDescriptor } from "./inline-tag-descriptor";
import type { TagDescriptor } from "./tag-descriptor";

export interface ParsedHtml {
  metas: TagDescriptor[];
  links: TagDescriptor[];
  scripts: TagDescriptor[];

  inlineStyles: InlineTagDescriptor[];
  inlineScripts: InlineTagDescriptor[];
}

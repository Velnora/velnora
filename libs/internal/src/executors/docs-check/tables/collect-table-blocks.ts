import { fencedLineVisibility } from "../code/fenced-line-visibility";
import { isTableLine } from "./is-table-line";
import type { TableBlock } from "./table-block";

export const collectTableBlocks = (source: string) => {
  const lines = source.split(/\r?\n/);
  const visible = fencedLineVisibility(source, { markdownFencesVisible: true });
  const blocks: TableBlock[] = [];
  let current: TableBlock | undefined;
  for (const [index, line] of lines.entries()) {
    if (!visible[index] || !isTableLine(line)) {
      current = undefined;
      continue;
    }
    if (!current) {
      current = { start: index, lines: [] };
      blocks.push(current);
    }
    current.lines.push(line);
  }
  return blocks;
};

import type { DocsProblem } from "../docs-problem";
import { alignTable } from "./align-table";
import { collectTableBlocks } from "./collect-table-blocks";
import { splitTableRow } from "./split-table-row";

export const checkTables = (file: string, source: string, fix: boolean) => {
  const lines = source.split(/\r?\n/);
  const problems: DocsProblem[] = [];
  const fixed: number[] = [];
  for (const block of collectTableBlocks(source)) {
    const rows = block.lines.map(splitTableRow);
    const columns = rows[0]?.length ?? 0;
    const ragged = [...rows.entries()].filter(([, cells]) => cells.length !== columns);
    for (const [row, cells] of ragged) {
      problems.push({
        file,
        line: block.start + row + 1,
        message: `Table row has ${cells.length} cells; expected ${columns}`
      });
    }
    if (ragged.length) {
      continue;
    }
    const aligned = alignTable(
      rows,
      block.lines.map(line => line.slice(0, line.indexOf("|")))
    );
    if (block.lines.every((line, row) => line === aligned[row])) {
      continue;
    }
    if (!fix) {
      problems.push({ file, line: block.start + 1, message: "Table is not aligned" });
      continue;
    }
    lines.splice(block.start, aligned.length, ...aligned);
    fixed.push(block.start + 1);
  }
  return { problems, fixed, content: lines.join(source.includes("\r\n") ? "\r\n" : "\n") };
};

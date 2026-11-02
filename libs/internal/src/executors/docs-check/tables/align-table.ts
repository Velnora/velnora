import stringWidth from "string-width";

/** The delimiter row (index 1) is left out of the widths, so a column can shrink when its widest cell does. */
export const alignTable = (rows: string[][], indentation: string[]) => {
  const widths = (rows[0] ?? []).map((_, column) =>
    Math.max(3, ...rows.filter((_, index) => index !== 1).map(row => stringWidth(row[column] ?? "")))
  );
  return rows.map((row, index) => {
    const cells = row.map((cell, column) => {
      const width = widths[column] ?? 3;
      if (index === 1 && /^:?-+:?$/.test(cell)) {
        const start = cell.startsWith(":") ? ":" : "";
        const end = cell.endsWith(":") ? ":" : "";
        return start + "-".repeat(width - start.length - end.length) + end;
      }
      return cell + " ".repeat(width - stringWidth(cell));
    });
    return `${indentation[index]}| ${cells.join(" | ")} |`;
  });
};

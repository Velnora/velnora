export const splitTableRow = (line: string) => {
  const content = line.trim().slice(1, -1);
  const cells: string[] = [];
  let cell = "";
  for (let index = 0; index < content.length; index++) {
    const character = content[index];
    if (character === "|" && content[index - 1] !== "\\") {
      cells.push(cell.trim());
      cell = "";
      continue;
    }
    cell += character;
  }
  cells.push(cell.trim());
  return cells;
};

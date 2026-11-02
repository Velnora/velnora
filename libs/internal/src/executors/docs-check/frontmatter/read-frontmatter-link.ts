export const readFrontmatterLink = (source: string, key: "prev" | "next") => {
  const lines = source.split(/\r?\n/);
  if (lines[0] !== "---") {
    return { name: undefined, line: 1 };
  }
  for (let index = 1; index < lines.length && lines[index] !== "---"; index++) {
    const line = lines[index] ?? "";
    if (!line.startsWith(`${key}:`)) {
      continue;
    }
    const value = line.slice(key.length + 1).trim();
    const name = value === "" || value === '""' ? "" : value.match(/^"\[\[([^\]]+)\]\]"$/)?.[1];
    return { name, line: index + 1 };
  }
  return { name: undefined, line: 1 };
};

export const isTableLine = (line: string) => {
  const trimmed = line.trim();
  return trimmed.startsWith("|") && trimmed.endsWith("|");
};

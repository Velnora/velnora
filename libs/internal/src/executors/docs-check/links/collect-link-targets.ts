export const collectLinkTargets = (line: string) => {
  const targets: string[] = [];
  for (const match of line.matchAll(/!?\[[^\]]*\]\(/g)) {
    const start = match.index + match[0].length;
    let end = start;
    let depth = 1;
    let angle = false;
    while (end < line.length && depth > 0) {
      const character = line[end];
      if (character === "\\") {
        end += 2;
        continue;
      }
      if (character === "<" && end === start) {
        angle = true;
      }
      if (character === ">") {
        angle = false;
      }
      if (!angle && character === "(") {
        depth++;
      }
      if (!angle && character === ")") {
        depth--;
      }
      if (depth > 0) {
        end++;
      }
    }
    if (depth !== 0) {
      continue;
    }
    const raw = line.slice(start, end).trim();
    const target = raw.startsWith("<") ? raw.slice(1, raw.indexOf(">")) : (raw.split(/\s+["']/)[0] ?? "");
    targets.push(target.replace(/\\([()\\])/g, "$1"));
  }
  return targets;
};

/**
 * @velnora-meta
 * type: author
 * author: MDReal
 */
import { basename } from "node:path";

import type { InputOption } from "rollup";

export const buildEntries = (pkgName: string, entries?: InputOption): InputOption => {
  if (typeof entries === "string") {
    return { [pkgName]: "src/main.ts", [`${pkgName}.${basename(entries)}`]: entries };
  }

  if (Array.isArray(entries)) {
    const base = { [pkgName]: "src/main.ts" };
    const entriesObj = entries.reduce(
      (acc, entry) => {
        acc[`velnora.${pkgName}.${basename(entry)}`] = entry;
        return acc;
      },
      {} as Record<string, string>
    );
    return { ...base, ...entriesObj };
  }

  const defaultFallback = { [pkgName]: "src/main.ts" };
  if (typeof entries === "object" && entries !== null) {
    const modifiedEntries = Object.fromEntries(
      Object.entries(entries).map(([key, value]) => [`${pkgName}.${key}`, value])
    );
    return { ...defaultFallback, ...modifiedEntries };
  }

  return defaultFallback;
};

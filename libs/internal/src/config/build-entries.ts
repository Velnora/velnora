/**
 * @velnora-meta
 * type: author
 * author: MDReal
 */

import { basename } from "node:path";

import type { InputOption } from "rollup";

export const buildEntries = (pkgName: string, entries?: InputOption): InputOption => {
  if (typeof entries === "string") {
    return { [pkgName]: "src/main.ts", [`velnora.${basename(entries)}`]: entries };
  }

  if (Array.isArray(entries)) {
    const base = { [pkgName]: "src/main.ts" };
    const entriesObj = entries.reduce(
      (acc, entry) => {
        acc[`${pkgName}.${basename(entry)}`] = entry;
        return acc;
      },
      {} as Record<string, string>
    );
    return { ...base, ...entriesObj };
  }

  if (typeof entries === "object" && entries !== null) {
    const base: Record<string, string> = { [pkgName]: "src/main.ts" };
    return { ...base, ...entries };
  }

  // If entries is undefined or of an unexpected type, return a default entry
  return { [pkgName]: "src/main.ts" };
};

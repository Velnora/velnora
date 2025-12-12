import { dirname } from "node:path";

import type { FsApi } from "@velnora/schemas";

import { LAYOUT_GLOB } from "../const";

export const collectLayoutsForPage = (pagePath: string, fs: FsApi, extensions: string[]) => {
  let currentDir = fs.resolve(pagePath);
  const layouts: string[] = [];

  while (true) {
    const matches = fs.glob(fs.resolve(currentDir, `${LAYOUT_GLOB}.{${extensions.join(",")}}`));

    if (matches.length > 0) {
      const layoutPath = fs.resolve(matches[0]!);
      layouts.push(layoutPath);
    }

    if (currentDir === fs.resolve("app")) break;
    const parentDir = dirname(currentDir);
    if (parentDir === currentDir) break;
    currentDir = parentDir;
  }

  return layouts;
};

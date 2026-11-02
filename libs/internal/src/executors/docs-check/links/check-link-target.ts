import { existsSync, readFileSync, statSync } from "node:fs";
import { dirname, extname, resolve } from "node:path";

import { collectHeadingSlugs } from "./collect-heading-slugs";

export const checkLinkTarget = (root: string, file: string, target: string) => {
  if (/^[a-z][a-z0-9+.-]*:/i.test(target)) {
    return undefined;
  }
  let decoded: string;
  try {
    decoded = decodeURIComponent(target);
  } catch {
    return `Invalid link encoding: ${target}`;
  }
  const hash = decoded.indexOf("#");
  const path = hash < 0 ? decoded : decoded.slice(0, hash);
  const anchor = hash < 0 ? "" : decoded.slice(hash + 1);
  const destination = path ? resolve(root, dirname(file), path) : resolve(root, file);
  if (!existsSync(destination)) {
    return `Missing link target: ${target}`;
  }
  if (!anchor || extname(destination) !== ".md" || !statSync(destination).isFile()) {
    return undefined;
  }
  if (!collectHeadingSlugs(readFileSync(destination, "utf8")).has(anchor)) {
    return `Missing heading anchor: ${target}`;
  }
  return undefined;
};

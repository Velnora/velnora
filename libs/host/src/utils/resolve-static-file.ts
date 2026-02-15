import { existsSync } from "node:fs";
import { resolve } from "node:path";

import type { Project } from "@velnora/types";

/**
 * Resolves a request path relative to a project's `src/` directory.
 *
 * Strips the project path prefix from the URL, falls back to `index.html`
 * for bare directory requests, and returns the absolute file path.
 *
 * @returns The absolute file path, or `;` if the file doesn't exist.
 */
export const resolveStaticFile = (project: Project, id: string) => {
  let relativePath = id.slice(project.path.length);

  // Strip leading slash
  if (relativePath.startsWith("/")) {
    relativePath = relativePath.slice(1);
  }

  // Bare path (e.g. /@example/app-one or /@example/app-one/) → index.html
  if (!relativePath) {
    relativePath = "index.html";
  }

  const file = resolve(project.root, "src", relativePath);
  return existsSync(file) ? file : null;
};

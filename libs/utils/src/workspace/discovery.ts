import fg from "fast-glob";

import type { Project } from "@velnora/types";

import { parseProjectEntry } from "./parse-project-entry";

export const findProjects = async (workspaceRoot: string) => {
  const entries = await fg(["**/package.json"], {
    cwd: workspaceRoot,
    ignore: ["**/node_modules/**", "**/dist/**", "**/build/**", "**/.git/**"],
    absolute: true
  });

  const projectsMap = new Map<string, Project>();

  const packageConfigResults = await Promise.all(entries.map(entry => parseProjectEntry(entry)));

  for (const result of packageConfigResults) {
    if (result) projectsMap.set(result.root, result);
  }

  return Array.from(projectsMap.values());
};

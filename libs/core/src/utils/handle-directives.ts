import { basename, extname } from "node:path";

import type { FluxoraAppConfig } from "@fluxora/types/core";

export const handleDirectives = (code: string, id: string, exposedModules: FluxoraAppConfig["exposedModules"]) => {
  const directiveRegex = /^(["'])use (.*)\1;?$/gm;
  const directives = (code.match(directiveRegex) || []).map(directive =>
    directive
      .replace(/^["']|["'];?$/g, "")
      .replace(/^use/, "")
      .trim()
  );

  if (directives.length) {
    const directivesSet = new Set(directives);
    if (directivesSet.has("expose")) {
      const name = basename(id, extname(id));
      exposedModules.set(id, name);
    }
  } else if (exposedModules.has(id)) {
    exposedModules.delete(id);
  }
};

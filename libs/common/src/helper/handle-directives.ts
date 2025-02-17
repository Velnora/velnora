import { basename, extname } from "node:path";

import * as t from "@babel/types";
import type { AppConfig } from "@fluxora/types";
import { traverse } from "@fluxora/utils/src/node/traverse";

interface Directive {
  code: string;
  start: number;
  end: number;
}

export const handleDirectives = (code: string, id: string, exposedModules: AppConfig["exposedModules"]) => {
  const directives: Directive[] = [];
  const exports = new Set<string>();

  traverse(code, {
    DirectiveLiteral(literal) {
      if (!literal.node.value.startsWith("use ")) return;
      directives.push({ code: literal.node.value.slice(4), start: literal.node.start!, end: literal.node.end! });
    },
    ExportNamedDeclaration(node) {
      if (t.isVariableDeclaration(node.node.declaration)) {
      }

      if (t.isFunctionDeclaration(node.node.declaration)) {
      }

      if (t.isClassDeclaration(node.node.declaration)) {
      }
    }
  });

  if (directives.length) {
    const directivesSet = new Set(directives.map(d => d.code));
    if (directivesSet.has("expose")) {
      exposedModules[id] = [];
    }
  } else if (exposedModules[id]) {
    delete exposedModules[id];
  }

  return directives;
};

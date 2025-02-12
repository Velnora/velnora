import { basename, extname } from "node:path";

import { parse } from "@babel/parser";
import traverse from "@babel/traverse";
import type { AppConfig } from "@fluxora/types";

interface Directive {
  code: string;
  start: number;
  end: number;
}

// @ts-expect-error
const traverseFn: typeof traverse = traverse.default;

export const handleDirectives = (code: string, id: string, exposedModules: AppConfig["exposedModules"]) => {
  const directives: Directive[] = [];
  const ast = parse(code, { sourceType: "module", plugins: ["typescript", "decorators-legacy", "jsx"] });

  traverseFn(ast, {
    DirectiveLiteral(literal) {
      if (!literal.node.value.startsWith("use ")) return;
      directives.push({ code: literal.node.value.slice(4), start: literal.node.start!, end: literal.node.end! });
    }
  });

  if (directives.length) {
    const directivesSet = new Set(directives.map(d => d.code));
    if (directivesSet.has("expose")) {
      exposedModules[id] = basename(id, extname(id));
    }
  } else if (exposedModules[id]) {
    delete exposedModules[id];
  }

  return directives;
};

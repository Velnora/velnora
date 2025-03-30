import { parse } from "@babel/parser";
import babelTraverse, { type TraverseOptions } from "@babel/traverse";

export const traverse = (code: string, visitor: TraverseOptions) => {
  const ast = parse(code, { sourceType: "module", plugins: ["typescript", "decorators-legacy", "jsx"] });
  babelTraverse(ast, visitor);
};

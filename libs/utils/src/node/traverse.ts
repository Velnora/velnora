import { parse } from "@babel/parser";
import babelTraverse, { type TraverseOptions } from "@babel/traverse";

// @ts-expect-error
const traverseFn: typeof babelTraverse = babelTraverse.default;

export const traverse = (code: string, visitor: TraverseOptions) => {
  const ast = parse(code, { sourceType: "module", plugins: ["typescript", "decorators-legacy", "jsx"] });
  traverseFn(ast, visitor);
};

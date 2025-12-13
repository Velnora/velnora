import { relative } from "node:path";

import { type Tree, writeJson } from "@nx/devkit";
import { formatFiles, generateFiles, joinPathFragments, names } from "@nx/devkit";
import { capitalize } from "@nx/devkit/src/utils/string-utils";

import type { PackageGeneratorSchema } from "./schema";

export default async function generator(tree: Tree, schema: PackageGeneratorSchema) {
  const pkg = names(schema.name);

  generateFiles(tree, joinPathFragments(__dirname, "files"), schema.directory, {
    name: pkg.name,
    target: capitalize(schema.target || "node"),
    scope: schema.scope
  });

  writeJson(tree, joinPathFragments(schema.directory, "tsconfig.json"), {
    extends: relative(schema.directory, "tsconfig.base.json").replaceAll("\\", "/")
  });

  await formatFiles(tree);
}

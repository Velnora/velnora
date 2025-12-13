import { relative } from "node:path";

import type { TsConfigJson } from "type-fest";

import { type Tree, updateJson, writeJson } from "@nx/devkit";
import { formatFiles, generateFiles, joinPathFragments, names } from "@nx/devkit";
import { capitalize } from "@nx/devkit/src/utils/string-utils";

import type { PackageGeneratorSchema } from "./schema";

export default async function generator(tree: Tree, schema: PackageGeneratorSchema) {
  const pkg = names(schema.name);

  const tags = ["type:lib", `scope:${schema.scope}`, ...([schema.tags].flat() || [])];

  generateFiles(tree, joinPathFragments(__dirname, "files"), schema.directory, {
    name: pkg.name,
    target: capitalize(schema.target || "node"),
    tags
  });

  writeJson<TsConfigJson>(tree, joinPathFragments(schema.directory, "tsconfig.json"), {
    extends: relative(schema.directory, "tsconfig.base.json").replaceAll("\\", "/")
  });

  updateJson<TsConfigJson>(tree, "tsconfig.base.json", json => {
    json.compilerOptions ||= {};
    json.compilerOptions.paths ||= {};
    json.compilerOptions.paths[`@velnora/${pkg.name}`] = [`./${joinPathFragments(schema.directory, "src/main.ts")}`];
    return json;
  });

  await formatFiles(tree);
}

/**
 * @velnora-meta
 * type: author
 * author: MDReal
 */
import { createRequire } from "node:module";
import { relative } from "node:path";

import type { PackageJson } from "type-fest";
import { type TsConfigJson } from "type-fest";

import {
  type Tree,
  formatFiles,
  generateFiles,
  getPackageManagerCommand,
  joinPathFragments,
  names,
  updateJson,
  writeJson
} from "@nx/devkit";
import { capitalize } from "@nx/devkit/src/utils/string-utils";

import type { PackageGeneratorSchema } from "./schema";
import { executeCommand } from "./utils/execute-command";

const require = createRequire(import.meta.url);
const pkgJson = require("../../../package.json") as PackageJson;

export default async function generator(tree: Tree, schema: PackageGeneratorSchema) {
  const pkg = names(schema.name);

  const tags = [
    "type:lib",
    `scope:${schema.scope}`,
    ...(Array.isArray(schema.tags) ? schema.tags : [schema.tags])
  ].filter(Boolean);

  generateFiles(tree, joinPathFragments(__dirname, "files/base"), schema.directory, {
    name: pkg.name,
    target: capitalize(schema.target || "node"),
    tags,
    skipTests: schema.skipTests,
    versions: {
      vite: pkgJson.dependencies!.vite
    }
  });

  if (!schema.skipTests) {
    generateFiles(tree, joinPathFragments(__dirname, "files/tests"), schema.directory, {});
  }

  writeJson<TsConfigJson>(tree, joinPathFragments(schema.directory, "tsconfig.json"), {
    extends: relative(schema.directory, "tsconfig.base").replaceAll("\\", "/")
  });

  updateJson<TsConfigJson>(tree, "tsconfig.base.json", json => {
    json.compilerOptions ||= {};
    json.compilerOptions.paths ||= {};
    json.compilerOptions.paths[`@velnora/${pkg.name}`] = [`./${joinPathFragments(schema.directory, "src/main.ts")}`];
    return json;
  });

  await formatFiles(tree);

  const pm = getPackageManagerCommand("yarn");

  return async () => {
    await executeCommand(pm.install);
    await executeCommand(pm.run("prepare"));
  };
}

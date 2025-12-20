import { execSync, spawn } from "node:child_process";
import { relative } from "node:path";

import type { TsConfigJson } from "type-fest";

import { type Tree, getPackageManagerCommand, updateJson, writeJson } from "@nx/devkit";
import { formatFiles, generateFiles, joinPathFragments, names } from "@nx/devkit";
import { capitalize } from "@nx/devkit/src/utils/string-utils";

import type { PackageGeneratorSchema } from "./schema";

export default async function generator(tree: Tree, schema: PackageGeneratorSchema) {
  const pkg = names(schema.name);

  const tags = [
    "type:lib",
    `scope:${schema.scope}`,
    ...(Array.isArray(schema.tags) ? schema.tags : [schema.tags])
  ].filter(Boolean);

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

  const pm = getPackageManagerCommand("yarn");

  return () => {
    const { promise, resolve, reject } = Promise.withResolvers<void>();

    const child = spawn(pm.install, {
      stdio: "inherit",
      shell: true,
      env: { ...process.env, YARN_ENABLE_HYPERLINKS: "0" }
    });

    child.on("exit", code => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`'${pm.install}' exited with code ${code}`));
      }
    });

    return promise;
  };
}

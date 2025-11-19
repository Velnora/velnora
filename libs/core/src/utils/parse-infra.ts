import { readFileSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";

import { glob } from "glob";
import type { PackageJson } from "type-fest";

import type { AppModuleGraph } from "@velnora/schemas";

import { debug } from "./debug";

const parseInfraDebug = debug.extend("parse-infra");

export const parseInfra = async (moduleGraph: AppModuleGraph) => {
  parseInfraDebug("starting infrastructure parsing");

  const pkgJsonFile = resolve("package.json");
  parseInfraDebug("resolved root package.json path: %O", { pkgJsonFile });

  const packageJson = JSON.parse(await readFile(pkgJsonFile, "utf-8")) as PackageJson;
  parseInfraDebug("loaded root package.json: %O", {
    hasWorkspaces: !!packageJson.workspaces
  });

  const workspaces = Array.isArray(packageJson.workspaces)
    ? packageJson.workspaces
    : packageJson.workspaces?.packages || [];

  parseInfraDebug("resolved workspaces: %O", { workspaces });

  const packages = await glob(
    workspaces.map(pkg => `${pkg}/package.json`),
    { absolute: true }
  );

  parseInfraDebug("matched workspace package.json files: %O", { packages });

  const pkgs = packages
    .map(pkgPath => {
      parseInfraDebug("found workspace package: %O", { pkgPath });

      const root = dirname(pkgPath);
      parseInfraDebug("resolved package root directory: %O", { pkgPath, root });

      const { default: _ignoredDefault, ...pkgJson } = JSON.parse(readFileSync(pkgPath, "utf-8")) as PackageJson;

      parseInfraDebug("imported package.json: %O", {
        pkgPath,
        hasName: !!pkgJson.name
      });

      if (!pkgJson.name) {
        parseInfraDebug("package has no name, skipping: %O", { pkgPath });
        return;
      }

      return { packageJson: pkgJson, root };
    })
    .filter(p => !!p);

  parseInfraDebug("summary of workspace package parsing: %O", {
    total: pkgs.length
  });

  parseInfraDebug("successfully parsed packages: %O", {
    count: pkgs.length,
    names: pkgs.map(p => p.packageJson.name)
  });

  pkgs.forEach(pkg => {
    parseInfraDebug("adding package to module graph: %O", {
      name: pkg.packageJson.name,
      root: pkg.root
    });

    moduleGraph.addModule(pkg.root, pkg.packageJson);
  });

  parseInfraDebug("finished parsing infrastructure: %O", {
    totalModules: pkgs.length
  });
};

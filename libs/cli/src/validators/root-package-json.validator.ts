import { readFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

import { PackageJson } from "type-fest";

import { logger } from "../utils/logger";
import type { RootPackageJsonValidatorOptions } from "./root-package-json.validator.types";

export const rootPackageJsonValidator = async (options: RootPackageJsonValidatorOptions) => {
  if (options.noValidate) {
    logger.debug("Skipping package.json validation");
    return;
  }

  logger.debug("Reading and parsing package.json");
  const pkgContent = await readFile(resolve(process.cwd(), "package.json"), "utf-8");
  const pkg = JSON.parse(pkgContent) as PackageJson;

  logger.debug("Package.json:", pkg);
  logger.debug("Checking package.json for validity for monorepo");

  if (!pkg.workspaces) {
    if (!options.auto) {
      logger.error(
        "No `workspaces` defined in package.json. Please define `workspaces` to continue or pass --auto flag to auto-configuration"
      );
      return;
    }

    pkg.workspaces = ["apps/*", "libs/*"];
    await writeFile(resolve(process.cwd(), "package.json"), JSON.stringify(pkg, null, 2), "utf-8");
  }
  logger.debug("package.json is valid");
};

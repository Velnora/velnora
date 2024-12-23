import { existsSync } from "node:fs";
import { readFile, readdir } from "node:fs/promises";
import { resolve } from "node:path";

import type { PackageJson, TsConfigJson } from "type-fest";

import { logger } from "../utils/logger";
import type { RootTsconfigJsonValidatorTypes } from "./root-tsconfig-json.validator.types";

export const rootTsconfigJsonValidator = async (options: RootTsconfigJsonValidatorTypes) => {
  if (options.noValidate) {
    logger.debug("Skipping tsconfig.json validation");
    return;
  }

  logger.debug("Reading and parsing tsconfig.json");
  const tsconfigContent = await readFile(resolve(process.cwd(), "tsconfig.json"), "utf-8");
  const tsconfig = JSON.parse(tsconfigContent) as TsConfigJson;

  logger.debug("tsconfig.json:", tsconfig);
  logger.debug("Checking tsconfig.json to validity for monorepo");

  if (!tsconfig.compilerOptions?.baseUrl && !tsconfig.compilerOptions?.paths) {
    if (!options.auto) {
      logger.error(
        "No `baseUrl` or `paths` defined in compilerOptions in tsconfig.json. Please define `baseUrl` and `paths` to continue or pass --auto flag to auto-configuration"
      );

      return;
    }

    logger.debug("Auto-configuring tsconfig.json for monorepo");
    tsconfig.compilerOptions ||= {};
    tsconfig.compilerOptions.baseUrl = ".";
    tsconfig.compilerOptions.paths = {};

    if (existsSync(resolve(process.cwd(), "libs"))) {
      logger.debug("Reading shared libraries");
      const libsDir = await readdir(resolve(process.cwd(), "libs"));

      for (const lib of libsDir) {
        const libPkgContent = await readFile(resolve(process.cwd(), "libs", lib, "package.json"), "utf-8");
        const libPkg = JSON.parse(libPkgContent) as PackageJson;
        if (libPkg.name) {
          tsconfig.compilerOptions!.paths![libPkg.name] = [`libs/${lib}/src/main.ts`];
        }
      }
    }
  }
  logger.debug("tsconfig.json is valid");
};

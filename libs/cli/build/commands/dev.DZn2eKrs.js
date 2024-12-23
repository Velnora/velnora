import { createServer } from '@fluxora/core';
import { readFile, writeFile, readdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import { l as logger, d as defineCommand } from '../fluxora.cli.js';
import { existsSync } from 'node:fs';

const rootPackageJsonValidator = async (options) => {
  if (options.noValidate) {
    logger.debug("Skipping package.json validation");
    return;
  }
  logger.debug("Reading and parsing package.json");
  const pkgContent = await readFile(resolve(process.cwd(), "package.json"), "utf-8");
  const pkg = JSON.parse(pkgContent);
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

const rootTsconfigJsonValidator = async (options) => {
  if (options.noValidate) {
    logger.debug("Skipping tsconfig.json validation");
    return;
  }
  logger.debug("Reading and parsing tsconfig.json");
  const tsconfigContent = await readFile(resolve(process.cwd(), "tsconfig.json"), "utf-8");
  const tsconfig = JSON.parse(tsconfigContent);
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
        const libPkg = JSON.parse(libPkgContent);
        if (libPkg.name) {
          tsconfig.compilerOptions.paths[libPkg.name] = [`libs/${lib}/src/main.ts`];
        }
      }
    }
  }
  logger.debug("tsconfig.json is valid");
};

const dev = defineCommand("dev", "Starting the development environment").option("auto", { type: "boolean", defaultValue: false, alias: "a", description: "Auto-configure the environment" }).option("no-validate", {
  type: "boolean",
  defaultValue: false,
  alias: "n",
  description: "Skip validations of the environment"
}).execute(async (args) => {
  await rootPackageJsonValidator(args);
  await rootTsconfigJsonValidator(args);
  const client = await createServer({ type: "client", env: "development", server: { port: 3e3 } });
  await client.serve();
  const server = await createServer({ type: "server", env: "development", server: { port: 5e3 } });
  await server.serve();
});
const devRunApp = defineCommand("dev:app", "Starting the development environment for a specific app").execute(
  // @ts-ignore
  async (args) => {
  }
);

export { dev, devRunApp };
//# sourceMappingURL=dev.DZn2eKrs.js.map

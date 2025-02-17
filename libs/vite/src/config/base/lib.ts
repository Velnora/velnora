import { dirname, resolve } from "node:path";

import chalk from "chalk";
import type { PackageJson } from "type-fest";

import type { Lib } from "@fluxora/types/core";
import { CLIENT_ENTRY_FILE_EXTENSIONS, createViteLogger } from "@fluxora/utils";
import { projectFs } from "@fluxora/utils/node";

import { findEntryFile } from "../../utils/find-entry-file";
import { logger } from "../../utils/logger";
import { getCommonConfiguration } from "../common-configuration";

export const getLibraryConfiguration = async (lib: Lib) => {
  const pkgJson = await projectFs.template.packageJson.readJson<PackageJson>();
  const filename = pkgJson.type === "module" ? `${lib.name}.js` : `${lib.name}.mjs`;
  const entryFile = findEntryFile(lib.root, "main", CLIENT_ENTRY_FILE_EXTENSIONS);

  lib.buildOutput = resolve(process.cwd(), ".fluxora/libs", lib.name, "build", filename);

  return getCommonConfiguration(lib, {
    root: process.cwd(),
    clearScreen: false,
    build: {
      ssr: true,
      lib: { entry: { [lib.name]: entryFile }, formats: ["es"] },
      outDir: dirname(lib.buildOutput)
    },
    customLogger: createViteLogger(logger),
    builder: {
      async buildApp(builder) {
        const startTime = performance.now();
        await builder.build(builder.environments.ssr);

        const diff = (performance.now() - startTime).toFixed(2);
        logger.info(chalk.green(`Library "${lib.name}" successfully compiled in ${diff}ms`));
      }
    }
  });
};

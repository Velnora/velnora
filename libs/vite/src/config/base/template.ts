import { dirname, resolve } from "node:path";

import chalk from "chalk";
import type { PackageJson } from "type-fest";

import type { Template } from "@fluxora/types/core";
import { CLIENT_ENTRY_FILE_EXTENSIONS, createViteLogger } from "@fluxora/utils";
import { projectFs } from "@fluxora/utils/node";

import { findEntryFile } from "../../utils/find-entry-file";
import { logger } from "../../utils/logger";
import { getCommonConfiguration } from "../common-configuration";

export const getTemplateConfiguration = async (template: Template) => {
  const pkgJson = await projectFs.template.packageJson.readJson<PackageJson>();
  const filename = pkgJson.type === "module" ? "template.js" : "template.mjs";
  const entryFile = findEntryFile(template.root, "main", CLIENT_ENTRY_FILE_EXTENSIONS);

  template.buildOutput = resolve(process.cwd(), ".fluxora", template.name, "build", filename);

  return getCommonConfiguration(template, {
    root: process.cwd(),
    clearScreen: false,
    build: {
      ssr: true,
      lib: { entry: { template: entryFile }, formats: ["es"] },
      outDir: dirname(template.buildOutput)
    },
    customLogger: createViteLogger(logger),
    builder: {
      async buildApp(builder) {
        const startTime = performance.now();
        await builder.build(builder.environments.ssr);

        const diff = (performance.now() - startTime).toFixed(2);
        logger.info(chalk.green(`Template "${template.name}" successfully compiled in ${diff}ms`));
      }
    }
  });
};

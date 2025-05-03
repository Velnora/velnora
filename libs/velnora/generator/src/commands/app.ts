import { PackageJson, TsConfigJson } from "type-fest";

import { appCtx } from "@velnora/runtime";

import type { AppCommandOptions } from "../../../cli/src/commands/generate/app";
import { applyClientFiles } from "../features/client";
import { applyServerFiles } from "../features/server";
import type { GenerateCommand } from "../types/generate-command";
import { generatedProjectFs } from "../utils/generated-project-fs";
import { logFileSuccess } from "../utils/log-file-success";
import { logger } from "../utils/logger";

export const generateApp: GenerateCommand<AppCommandOptions> = async options => {
  const name = options.pkgName || options.name;
  logger.info(`Preparing to generate app ${name}...`);

  await appCtx.resolveConfig();

  const projectFs = generatedProjectFs(options);

  if (options.type === "client" || !options.type) {
    await applyClientFiles(projectFs, options);
  }

  if (options.type === "server" || !options.type) {
    await applyServerFiles(projectFs, options);
  }

  await projectFs.packageJson.extendJson<PackageJson>({ name, version: "0.0.0-dev.0" });
  logFileSuccess(projectFs.dot.relative(projectFs.packageJson.$raw));

  await projectFs.tsconfig.extendJson<TsConfigJson>({
    extends: projectFs.tsconfig.relative(projectFs.root.tsconfig)
  });
  logFileSuccess(projectFs.dot.relative(projectFs.tsconfig.$raw));
};

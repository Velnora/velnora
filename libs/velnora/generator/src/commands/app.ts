import { PackageJson, TsConfigJson } from "type-fest";

import { appCtx } from "@velnora/runtime";

import type { AppCommandOptions } from "../../../cli/src/commands/generate/app";
import { applyClientFiles } from "../features/client";
import { applyServerFiles } from "../features/server";
import type { GenerateCommand } from "../types/generate-command";
import { generateProjectFs } from "../utils/generate-project-fs";
import { logFileSuccess } from "../utils/log-file-success";
import { logger } from "../utils/logger";

export const generateApp: GenerateCommand<AppCommandOptions> = async options => {
  const name = options.pkgName || options.name;
  logger.info(`Preparing to generate app ${name}...`);

  await appCtx.resolveConfig();

  const rootFs = generateProjectFs();
  const appProjectFs = rootFs.apps.app(options);

  if (options.type === "client" || !options.type) {
    await applyClientFiles(rootFs, options);
  }

  if (options.type === "server" || !options.type) {
    await applyServerFiles(rootFs, options);
  }

  await appProjectFs.packageJson.extendJson<PackageJson>({ name, version: "0.0.0-dev.0" });
  logFileSuccess(rootFs.dot.relative(appProjectFs.packageJson.$raw));

  await appProjectFs.tsconfig.extendJson<TsConfigJson>({
    extends: appProjectFs.tsconfig.relative(rootFs.tsconfig.$raw)
  });
  logFileSuccess(rootFs.dot.relative(appProjectFs.tsconfig.$raw));
};

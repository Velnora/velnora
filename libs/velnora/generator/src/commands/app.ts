import { appCtx } from "@velnora/runtime";

import type { AppCommandOptions } from "../../../cli/src/commands/generate/app";
import { generateAppFiles } from "../core/generate-app-files";
import type { GenerateCommand } from "../types/generate-command";
import { FileLogger } from "../utils/file-logger";
import { generateProjectFs } from "../utils/generate-project-fs";
import { logger } from "../utils/logger";

export const generateApp: GenerateCommand<AppCommandOptions> = async options => {
  const pkgName = options.pkgName || options.name;
  logger.info(`Preparing to generate app ${pkgName}...`);
  await appCtx.resolveConfig();

  const fs = generateProjectFs();
  const fileLogger = new FileLogger(fs.dot.dirname);

  await generateAppFiles(fs, fileLogger, {
    type: options.type,
    app: { name: options.name, pkgName }
  });
};

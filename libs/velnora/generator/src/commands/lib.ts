import { PackageJson, TsConfigJson } from "type-fest";

import { appCtx } from "@velnora/runtime";

import type { LibCommandOptions } from "../../../cli/src/commands/generate/lib";
import type { GenerateCommand } from "../types/generate-command";
import { FileLogger } from "../utils/file-logger";
import { generateProjectFs } from "../utils/generate-project-fs";
import { logger } from "../utils/logger";

export const generateLib: GenerateCommand<LibCommandOptions> = async options => {
  const name = options.pkgName || options.name;
  logger.info(`Preparing to generate library ${name}...`);

  await appCtx.resolveConfig();

  const fs = generateProjectFs();
  const libFs = fs.libs.lib(options.name, options.jsx);
  const fileLogger = new FileLogger(fs.dot.dirname);

  await libFs.src.main.write(`export default {};`);
  fileLogger.created(libFs.src.main);

  await libFs.packageJson.extendJson<PackageJson>({ name, version: "0.0.0-dev.0" });
  fileLogger.created(libFs.packageJson);

  await libFs.tsconfig.extendJson<TsConfigJson>({
    extends: libFs.tsconfig.relative(fs.tsconfig.$raw),
    include: ["src/**/*.ts", "src/**/*.tsx"]
  });
  fileLogger.created(libFs.tsconfig);

  await fs.tsconfig.extendJson<TsConfigJson>({
    compilerOptions: { paths: { [name]: [fs.libs.relative(libFs.src.main.$raw)] } }
  });
  fileLogger.updated(fs.tsconfig);
};

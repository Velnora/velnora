import pc from "picocolors";
import { PackageJson, TsConfigJson } from "type-fest";

import { appCtx } from "@velnora/runtime";

import type { LibCommandOptions } from "../../../cli/src/commands/generate/lib";
import type { GenerateCommand } from "../types/generate-command";
import { generateProjectFs } from "../utils/generate-project-fs";
import { logFileSuccess } from "../utils/log-file-success";
import { logger } from "../utils/logger";

export const generateLib: GenerateCommand<LibCommandOptions> = async options => {
  const name = options.pkgName?.replace(/[A-Z]/g, s => `-${s.toLowerCase()}`) || options.name;
  logger.info(`Preparing to generate library ${name}...`);

  await appCtx.resolveConfig();

  const rootFs = generateProjectFs();
  const libProjectFs = rootFs.libs.lib(options);

  await libProjectFs.src.main.write(`export default {};`);
  logFileSuccess(rootFs.libs.relative(libProjectFs.src.main.$raw));

  await libProjectFs.packageJson.extendJson<PackageJson>({ name, version: "0.0.0-dev.0" });
  logFileSuccess(rootFs.libs.relative(libProjectFs.packageJson.$raw));

  await libProjectFs.tsconfig.extendJson<TsConfigJson>({
    extends: libProjectFs.tsconfig.relative(rootFs.tsconfig.$raw),
    include: ["src/**/*.ts", "src/**/*.tsx"]
  });
  logFileSuccess(rootFs.libs.relative(libProjectFs.tsconfig.$raw));

  await rootFs.tsconfig.extendJson<TsConfigJson>({
    compilerOptions: { paths: { [name]: [rootFs.libs.relative(libProjectFs.src.main.$raw)] } }
  });
  logger.success(`${pc.cyan(rootFs.libs.relative(rootFs.tsconfig.$raw))} ${pc.yellow("updated")}`);
};

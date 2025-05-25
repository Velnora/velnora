import { PackageJson, TsConfigJson } from "type-fest";

import type { AppCommandOptions } from "../../../cli/src/commands/generate/app";
import type { FileLogger } from "../utils/file-logger";
import type { GeneratedProjectFs } from "../utils/generate-project-fs";
import { generateClientSideFiles } from "./generate-client-side-files";
import { generateServerSideFiles } from "./generate-server-side-files";

export interface GenerateAppOptions extends Partial<Pick<AppCommandOptions, "type">> {
  app: { name: string; pkgName: string };
}

export const generateAppFiles = async (fs: GeneratedProjectFs, fileLogger: FileLogger, options: GenerateAppOptions) => {
  const appFs = fs.apps.app(options.app.name);

  if (!options.type || options.type === "client") {
    await generateClientSideFiles(fs, fileLogger, options);
  }

  if (!options.type || options.type === "server") {
    await generateServerSideFiles(fs, fileLogger, options);
  }

  await appFs.tsconfig.extendJson<TsConfigJson>({
    extends: appFs.tsconfig.relative(fs.tsconfig.$raw)
  });
  fileLogger.created(appFs.tsconfig);

  await appFs.packageJson.extendJson<PackageJson>({
    name: options.app.pkgName
  });
  fileLogger.created(appFs.packageJson);
};

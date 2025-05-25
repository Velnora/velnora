import { resolve } from "node:path";

import { PackageJson, TsConfigJson } from "type-fest";

import { Emojis } from "@velnora/logger";
import { appCtx } from "@velnora/runtime";

import type { GenerateProjectCommandOptions } from "../../../cli/src/commands/generate/project";
import { version as velnoraVersion } from "../../../package.json";
import { generateAppFiles } from "../core/generate-app-files";
import { generatePrettierConfiguration } from "../core/generate-prettier-configuration";
import { FileLogger } from "../utils/file-logger";
import { generateProjectFs } from "../utils/generate-project-fs";
import { getLatestVersion } from "../utils/get-latest-version";
import { logger } from "../utils/logger";

declare const __DEV__: boolean;

export const newProject = async (options: GenerateProjectCommandOptions) => {
  const root = resolve(options.name);
  logger.info(Emojis.info, "Creating new Velnora project.");
  logger.debug(Emojis.debug, "root:", root);

  await appCtx.resolveConfig();

  if (options.appsDir) appCtx.projectStructure.apps.root = options.appsDir;
  if (options.libsDir) appCtx.projectStructure.libs.root = options.libsDir;
  if (options.templateDir) appCtx.projectStructure.template.root = options.templateDir;

  const fs = generateProjectFs(root);
  const fileLogger = new FileLogger(fs.dot.dirname);

  await generateAppFiles(fs, fileLogger, {
    app: { name: "landing", pkgName: options.scope ? `${options.scope}/landing` : "landing" }
  });

  await fs.env.create();
  fileLogger.created(fs.env);

  if (options.prettier) {
    await generatePrettierConfiguration(fs, fileLogger, options);
  }

  await fs.packageJson.extendJson<PackageJson>({
    name: options.scope ? `${options.scope}/monorepo` : "monorepo",
    version: "0.0.0-dev.0",
    type: "module",
    workspaces: ["apps/*", "libs/*", "template"],
    scripts: { build: "dev build", dev: "dev dev" },
    dependencies: {
      "reflect-metadata": await getLatestVersion("reflect-metadata"),
      "velnora": __DEV__ ? "workspace:^" : velnoraVersion
    }
  });
  fileLogger.created(fs.packageJson);

  await fs.tsconfig.extendJson<TsConfigJson>({
    compilerOptions: {
      experimentalDecorators: true,
      emitDecoratorMetadata: true,
      baseUrl: ".",
      paths: {}
    },
    include: ["**/*.ts", "**/*.tsx", "velnora-env.d.ts"]
  });
  fileLogger.created(fs.tsconfig);

  await fs.velnoraConfig.write(`import { defineConfig } from "velnora";

  export default defineConfig({
    projectStructure: {
      apps: {
        hostAppName: "landing"
      }
    }
  });
  `);
  fileLogger.created(fs.velnoraConfig);

  await fs.velnoraEnv.write(`/// <reference types="velnora/client" />
  `);
  fileLogger.created(fs.velnoraEnv);
};

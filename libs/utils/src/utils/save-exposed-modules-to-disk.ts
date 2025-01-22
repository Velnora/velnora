import { mkdir, writeFile } from "node:fs/promises";
import { dirname, relative, resolve } from "node:path";

import type { FluxoraApp } from "@fluxora/types/core";

const createExportScript = (relativePath: string): string => `export * from "${relativePath}";\n`;

const createRootDeclareModuleScript = (moduleName: string, modulePaths: string[]): string => {
  const moduleExports = modulePaths.map(path => `  export * from "${path}";`).join("\n");

  return `declare module "${moduleName}" {\n${moduleExports}\n}`;
};

const createDeclareModuleScript = (moduleName: string, relativePath: string): string => {
  return `declare module "${moduleName}" {\n  export type * from "${relativePath}";\n}`;
};

const preparePaths = (config: FluxoraApp) => {
  const appBasePath = resolve(config.cacheRoot, "apps", config.app.name);

  return {
    appBasePath,
    typesDir: resolve(appBasePath, "types"),
    modulesDir: resolve(appBasePath, "modules"),
    mainDeclareModuleFile: resolve(appBasePath, "types", `${config.app.name}.d.ts`),
    mainExportFile: resolve(appBasePath, "modules", `${config.app.name}.ts`)
  };
};

const processModules = (config: FluxoraApp, paths: Record<string, string>) => {
  return Array.from(config.exposedModules.entries()).map(([filePath, moduleName]) => {
    const moduleFilePath = resolve(paths.modulesDir, config.app.name, `${moduleName}.ts`);
    const declareModuleFilePath = resolve(paths.typesDir, config.app.name, `${moduleName}.d.ts`);
    const relativeModulePath = relative(resolve(paths.modulesDir, config.app.name), filePath);

    return {
      exportStatement: `export * from "./${config.app.name}/${moduleName}.ts";\n`,
      writeOperations: [
        mkdir(dirname(moduleFilePath), { recursive: true }).then(() =>
          writeFile(moduleFilePath, createExportScript(relativeModulePath))
        ),
        mkdir(dirname(declareModuleFilePath), { recursive: true }).then(() =>
          writeFile(
            declareModuleFilePath,
            createDeclareModuleScript(`${config.app.name}/${moduleName}`, relativeModulePath)
          )
        )
      ],
      relativeModulePath
    };
  });
};

export const saveExposedModulesToDisk = async (config: FluxoraApp): Promise<void> => {
  const paths = preparePaths(config);

  // Create directories
  await Promise.all([mkdir(paths.typesDir, { recursive: true }), mkdir(paths.modulesDir, { recursive: true })]);

  // Process modules
  const moduleData = processModules(config, paths);
  const mainExportCode = moduleData.length
    ? moduleData.map(({ exportStatement }) => exportStatement).join("")
    : "export {};";

  const relativeModulePaths = moduleData.map(({ relativeModulePath }) => relativeModulePath);

  const writePromises = moduleData.flatMap(({ writeOperations }) => writeOperations);

  writePromises.push(
    writeFile(paths.mainExportFile, mainExportCode),
    writeFile(paths.mainDeclareModuleFile, createRootDeclareModuleScript(config.app.name, relativeModulePaths))
  );

  await Promise.all(writePromises);
};

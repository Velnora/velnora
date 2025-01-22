import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { dirname, relative, resolve } from "node:path";

import { TsConfigJson } from "type-fest";

import type { FluxoraConfig } from "@fluxora/types/core";

export const generateDotFluxoraExtraFiles = (config: FluxoraConfig) => {
  const { cacheRoot } = config;
  const gitignoreFile = resolve(cacheRoot, ".gitignore");
  if (!existsSync(gitignoreFile)) {
    const gitignoreContent = ["*", ".*"].join("\n") + "\n";
    mkdirSync(cacheRoot, { recursive: true });
    writeFileSync(gitignoreFile, gitignoreContent);
  }

  const rootTsConfigFile = resolve(process.cwd(), "tsconfig.json");
  const tsconfigFile = resolve(cacheRoot, "tsconfig.json");
  if (!existsSync(tsconfigFile)) {
    const relativeExtendsPath = relative(dirname(tsconfigFile), rootTsConfigFile);
    const tsconfigContent = JSON.stringify({
      extends: relativeExtendsPath,
      compilerOptions: { allowImportingTsExtensions: true }
    } as TsConfigJson);
    writeFileSync(tsconfigFile, tsconfigContent);
  }

  [cacheRoot, ...config.apps.map(app => resolve(cacheRoot, "apps", app.name))].map(dir => {
    const pkgJsonFile = resolve(dir, "package.json");
    mkdirSync(dir, { recursive: true });
    if (!existsSync(pkgJsonFile)) {
      const pkgJsonContent = JSON.stringify({ type: "module" });
      writeFileSync(pkgJsonFile, pkgJsonContent);
    }
  });
};

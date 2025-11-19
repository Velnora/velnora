import { existsSync, readFileSync } from "node:fs";

import type { WithDefault } from "@velnora/schemas";

import { debug } from "./debug";
import { devRunner } from "./vite";

const loadConfigFileDebug = debug.extend("load-config-file");

export const loadConfigFile = async <TConfig>(configFile: string): Promise<TConfig> => {
  if (existsSync(`${configFile}.json`)) {
    loadConfigFileDebug("loading JSON config file: %O", { path: `${configFile}.json` });
    return (await import(`${configFile}.json`)) as TConfig;
  }

  if (existsSync(`${configFile}.yml`) || existsSync(`${configFile}.yaml`)) {
    const configPath = existsSync(`${configFile}.yml`) ? `${configFile}.yml` : `${configFile}.yaml`;
    loadConfigFileDebug("loading YAML config file: %O", { path: configPath });

    const { parse } = await import("yaml");
    return parse(readFileSync(configPath, "utf-8")) as TConfig;
  }

  if (existsSync(`${configFile}.ts`) || existsSync(`${configFile}.js`)) {
    const configPath = existsSync(`${configFile}.ts`) ? `${configFile}.ts` : `${configFile}.js`;
    loadConfigFileDebug("loading JS/TS config file: %O", { path: configPath });

    const importedConfig = await devRunner.import<WithDefault<TConfig>>(configPath);
    return (importedConfig.default || {}) as TConfig;
  }

  return {} as TConfig;
};

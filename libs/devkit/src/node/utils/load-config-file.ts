import { existsSync, readFileSync } from "node:fs";

import type { WithDefault } from "@velnora/types";
import { devRunner } from "@velnora/vite-integration";

import { debug } from "./debug";

const loadConfigFileDebug = debug.extend("load-config-file");

export const loadConfigFile = async <TConfig>(configFile: string): Promise<TConfig> => {
  if (existsSync(`${configFile}.json`)) {
    loadConfigFileDebug("loading JSON config file: %O", { path: `${configFile}.json` });
    const config = await devRunner.import<WithDefault<TConfig>>(`${configFile}.json`);
    if (config.default) return config.default;
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

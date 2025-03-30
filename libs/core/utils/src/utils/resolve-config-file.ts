import { existsSync } from "node:fs";

import { isRunnableDevEnvironment } from "vite";

import { internalViteServer } from "./internal-vite-server";

export const resolveConfigFile = async <TConfig extends {}>(configFilePath: string): Promise<TConfig | undefined> => {
  if (!existsSync(configFilePath)) return;
  const serverEnv = internalViteServer.environments.server;
  if (!isRunnableDevEnvironment(serverEnv)) return;
  try {
    const module = await serverEnv.runner.import<{ default: TConfig }>(configFilePath);
    return module.default;
  } catch (error) {
    console.error("Error resolving config file:", error);
  }
};

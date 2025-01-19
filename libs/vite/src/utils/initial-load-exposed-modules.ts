import { readFile } from "node:fs/promises";
import { resolve } from "node:path";

import { glob } from "glob";

import type { FluxoraAppConfig } from "@fluxora/types/core";
import { CLIENT_ENTRY_FILE_EXTENSIONS } from "@fluxora/utils";

import { handleDirectives } from "./handle-directives";

export const initialLoadExposedModules = async (
  appName: string,
  exposedModules: FluxoraAppConfig["exposedModules"]
) => {
  const files = glob.sync(resolve("apps", appName, "src", "**", `*.{${CLIENT_ENTRY_FILE_EXTENSIONS.join(",")}}`), {
    absolute: true
  });

  for (const file of files) {
    const content = await readFile(file, "utf-8");
    handleDirectives(content, file, exposedModules);
  }
};

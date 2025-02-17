import { basename, dirname } from "node:path";

import type { InlineConfig } from "vite";

export const configurationResolving = (configFilePath: string) => {
  const jsFilePath = `${configFilePath}.${Date.now()}.js`;
  const name = basename(jsFilePath, ".js");

  return {
    build: {
      ssr: true,
      lib: { entry: { [name]: configFilePath }, formats: ["es"] },
      rollupOptions: { onwarn() {} },
      outDir: dirname(configFilePath),
      emptyOutDir: false
    },
    logLevel: "silent"
  } satisfies InlineConfig;
};

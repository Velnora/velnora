import { existsSync } from "node:fs";
import { rm, writeFile } from "node:fs/promises";
import { basename, dirname } from "node:path";

import { build } from "vite";

export const resolveConfigFile = async <TReturnType>(configFilePath: string) => {
  if (!existsSync(configFilePath)) return;
  const jsFilePath = `${configFilePath}.${Date.now()}.js`;
  const name = basename(jsFilePath, ".js");
  const result = await build({
    build: {
      ssr: true,
      lib: { entry: { [name]: configFilePath }, formats: ["es"] },
      rollupOptions: { onwarn() {} },
      outDir: dirname(configFilePath),
      emptyOutDir: false
    },
    logLevel: "silent"
  });

  const res = Array.isArray(result) ? result[0] : result;

  if (!("output" in res)) {
    return;
  }

  const js = res.output[0].code;
  await writeFile(jsFilePath, js);
  const conf = (await import(jsFilePath)) as { default: TReturnType };
  if (!("default" in conf)) return;
  await rm(jsFilePath);
  return conf.default;
};

import { existsSync } from "node:fs";
import { rm, writeFile } from "node:fs/promises";
import { basename, dirname } from "node:path";

import { AppType } from "@fluxora/types/core";
import { build, configurationResolving } from "@fluxora/vite";

export const resolveConfigFile = async <TReturnType>(configFilePath: string) => {
  if (!existsSync(configFilePath)) return;
  await build(configurationResolving(configFilePath));

  // const res = Array.isArray(result) ? result[0] : result;
  //
  // if (!("output" in res)) {
  //   return;
  // }
  //
  // const jsFilePath = res.output[0].filename;
  //
  // const js = res.output[0].code;
  // await writeFile(jsFilePath, js);
  // const conf = (await import(jsFilePath)) as { default: TReturnType };
  // if (!("default" in conf)) return;
  // await rm(jsFilePath);
  // return conf.default;
};

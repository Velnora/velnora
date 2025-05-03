import type { Config as PrettierConfig } from "prettier";

import type { AppCommandOptions } from "../../../cli/src/commands/generate/app";
import type { GeneratedProjectFs } from "../utils/generated-project-fs";
import { logFileSuccess } from "../utils/log-file-success";

const getLatestVersion = async (pkg: string) => {
  const response = await fetch(`https://registry.npmjs.org/${pkg}/latest`);
  const npmRegistry = await response.json();
  return npmRegistry.version;
};

export const applyPrettier = async (fs: GeneratedProjectFs, options: AppCommandOptions) => {
  // const plugins = options.prettierPlugins ?? [];

  await fs.packageJson.extendJson({
    devDependencies: {
      prettier: await getLatestVersion("prettier")
      //     ...(plugins.includes("plugin-sort") && { "prettier-plugin-sort": Versions["prettier-plugin-sort"] }),
      //     ...(plugins.includes("plugin-tailwindcss") && {
      //       "prettier-plugin-tailwindcss": Versions["prettier-plugin-tailwindcss"]
      //     })
    }
  });

  await fs.prettier.extendJson<PrettierConfig>({});
  logFileSuccess(fs.dot.relative(fs.prettier.$raw));
};

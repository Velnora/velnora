import type { Config as PrettierConfig } from "prettier";

import type { GenerateProjectCommandOptions } from "../../../cli/src/commands/generate/project";
import type { FileLogger } from "../utils/file-logger";
import type { GeneratedProjectFs } from "../utils/generate-project-fs";
import { getLatestVersion } from "../utils/get-latest-version";

export const generatePrettierConfiguration = async (
  fs: GeneratedProjectFs,
  fileLogger: FileLogger,
  _options: GenerateProjectCommandOptions
) => {
  await fs.packageJson.extendJson({
    devDependencies: {
      prettier: await getLatestVersion("prettier")
      //     ...(plugins.includes("plugin-sort") && { "prettier-plugin-sort": Versions["prettier-plugin-sort"] }),
      //     ...(plugins.includes("plugin-tailwindcss") && {
      //       "prettier-plugin-tailwindcss": Versions["prettier-plugin-tailwindcss"]
      //     })
    }
  });

  await fs.prettier.extendJson<PrettierConfig>({
    arrowParens: "avoid",
    printWidth: 120,
    quoteProps: "consistent",
    trailingComma: "none"
  });
  fileLogger.created(fs.prettier);

  /*
   plugins: ["@trivago/prettier-plugin-sort-imports", "prettier-plugin-packagejson"],
    importOrder: [
      "^node:(.*)$|^([of]s|http[2s]?|(perf|async)_hooks|v[8m]|path|url|crypto|stream|buffer|util|querystring|events|assert|constants|zlib|tty|child_process|cluster|dgram|dns|domain|net|readline|repl|tls|inspector|worker_threads|punycode)(/.*$|$)",
      "^([^.@]*)$",
      "^@(.+)/(.*)$",
      "^@/(.*)$",
      "^[./](.*)(?<!\\.(?:css|svg|png|jpg|jpeg))$",
      "\\.(?:css|svg|png|jpg|jpeg)$"
    ],
    importOrderParserPlugins: ["typescript", "jsx", "decorators-legacy"],
    importOrderSeparation: true,
    importOrderSortSpecifiers: true
  * */
};

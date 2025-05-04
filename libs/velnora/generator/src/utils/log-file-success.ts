import pc from "picocolors";

import { logger } from "./logger";

export const logFileSuccess = (filePath: string) => {
  const [section, appName, module, ...paths] = filePath.split("/");
  const names = [
    section,
    appName,
    module === "client"
      ? pc.blue(module)
      : module === "server"
        ? pc.red(module)
        : module === "src"
          ? pc.cyan(`${module}/${paths.join("/")}`)
          : pc.cyan(module),
    paths.length && module !== "src" ? pc.cyan(paths.join("/")) : null
  ].filter(Boolean);
  logger.success(pc.gray(names.join("/")), pc.magenta("created"));
};

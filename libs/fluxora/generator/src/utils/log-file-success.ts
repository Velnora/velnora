import pc from "picocolors";

import { logger } from "./logger";

export const logFileSuccess = (filePath: string) => {
  const [appName, module, ...paths] = filePath.split("/");
  const names = [
    appName,
    module === "client" ? pc.blue(module) : module === "server" ? pc.red(module) : pc.cyan(module),
    paths.length ? pc.cyan(paths.join("/")) : null
  ].filter(Boolean);
  logger.success(pc.gray(names.join("/")), pc.magenta("created"));
};

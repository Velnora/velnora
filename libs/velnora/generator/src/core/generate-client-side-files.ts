import type { FileLogger } from "../utils/file-logger";
import type { GeneratedProjectFs } from "../utils/generate-project-fs";
import type { GenerateAppOptions } from "./generate-app-files";

export const generateClientSideFiles = async (
  fs: GeneratedProjectFs,
  fileLogger: FileLogger,
  options: GenerateAppOptions
) => {
  const clientFs = fs.apps.app(options.app.name).client;

  await clientFs.app.page.write(
    `import type { FC } from "react";

  export default (() => {
    return <div>Hello ${options.app.pkgName}.</div>;
  }) satisfies FC;`
  );
  fileLogger.created(clientFs.app.page);

  await clientFs.routes.write(
    `import { defineRoutes } from "velnora/router";

  export const routes = defineRoutes([{ path: "/", component: () => import("./app/page") }]);`
  );
  fileLogger.created(clientFs.routes);
};

import { PackageJson } from "type-fest";

import type { FileLogger } from "../utils/file-logger";
import type { GeneratedProjectFs } from "../utils/generate-project-fs";
import { getLatestVersion } from "../utils/get-latest-version";
import type { GenerateAppOptions } from "./generate-app-files";

export const generateClientSideFiles = async (
  fs: GeneratedProjectFs,
  fileLogger: FileLogger,
  options: GenerateAppOptions
) => {
  const appFs = fs.apps.app(options.app.name);
  const clientFs = appFs.client;

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

  await appFs.packageJson.extendJson<PackageJson>({
    dependencies: {
      react: await getLatestVersion("react")
    }
  });
};

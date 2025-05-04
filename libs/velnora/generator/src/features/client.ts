import type { AppCommandOptions } from "../../../cli/src/commands/generate/app";
import type { GeneratedProjectFs } from "../utils/generate-project-fs";
import { logFileSuccess } from "../utils/log-file-success";

export async function applyClientFiles(fs: GeneratedProjectFs, options: AppCommandOptions) {
  const appProjectFs = fs.apps.app(options);

  await appProjectFs.client.app.page.write(
    `import type { FC } from "react";

  export default (() => {
    return <div>Hello "${options.name}".</div>;
  }) satisfies FC;`
  );
  logFileSuccess(fs.apps.relative(appProjectFs.client.app.page.$raw));

  await appProjectFs.client.routes.write(
    `import { defineRoutes } from "velnora/router";

  export const routes = defineRoutes([{ path: "/", component: () => import("./app/page") }]);`
  );
  logFileSuccess(fs.apps.relative(appProjectFs.client.routes.$raw));
}

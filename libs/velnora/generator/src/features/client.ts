import type { AppCommandOptions } from "../../../cli/src/commands/generate/app";
import type { GeneratedProjectFs } from "../utils/generated-project-fs";
import { logFileSuccess } from "../utils/log-file-success";

export async function applyClientFiles(fs: GeneratedProjectFs, options: AppCommandOptions) {
  await fs.client.app.page.write(
    `import type { FC } from "react";

export default (() => {
  return <div>Hello "${options.name}".</div>;
}) satisfies FC;`
  );
  logFileSuccess(fs.dot.relative(fs.client.app.page.$raw));

  await fs.client.routes.write(
    `import { defineRoutes } from "velnora/router";

export const routes = defineRoutes([{ path: "/", component: () => import("./app/page") }]);`
  );
  logFileSuccess(fs.dot.relative(fs.client.routes.$raw));
}

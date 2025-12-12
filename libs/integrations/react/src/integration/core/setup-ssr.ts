import type { VelnoraContext } from "@velnora/schemas";

import { setupAppSsr } from "./setup-app-ssr";
import { setupSingleFileSsr } from "./setup-single-file-ssr";

export const setupSsr = (ctx: VelnoraContext) => {
  if (ctx.fs.exists("app/**/page.{js,ts,jsx,tsx}")) {
    return setupAppSsr(ctx);
  }

  if (ctx.fs.exists("app.{js,ts,jsx,tsx}")) {
    return setupSingleFileSsr(ctx);
  }

  ctx.logger.error(
    `Could not find any SSR entry points for app "${ctx.app.packageJson.name}". Make sure you have either "app.{js,ts,jsx,tsx}" or "app/**/page.{js,ts,jsx,tsx}" files.`
  );
};

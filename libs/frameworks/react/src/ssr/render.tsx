import type { FC } from "react";
import { renderToPipeableStream } from "react-dom/server";

import type { SSRRenderContext } from "@fluxora/framework-loader";
import { appCtx } from "@fluxora/runtime";
import type { WithDefault } from "@fluxora/types";
import { capitalize } from "@fluxora/utils";

export const render = async (ctx: SSRRenderContext) => {
  const templateEntry = ctx.template.getEntryPoint();
  const appModuleName = capitalize(ctx.app.name);
  const templateModuleName = capitalize(ctx.template.name);
  const ssrRunner = appCtx.vite.getSsr(ctx.app.name);

  const [appModule, templateModule] = await Promise.all([
    ctx.app.config.ssr
      ? ctx.route.component<WithDefault<FC, Record<string, FC>>>()
      : Promise.resolve({ default: () => <></> } as WithDefault<FC, Record<string, FC>>),
    templateEntry ? ssrRunner.runner.import(templateEntry) : Promise.resolve({})
  ]);

  const AppComponent = appModule[appModuleName] || appModule.default;
  const TemplateComponent = templateModule[templateModuleName] || templateModule.App || templateModule.default;

  if (!AppComponent) {
    // ToDo: Handle Error
    throw new Error(`App component not found in ${ctx.route.path}`);
  }

  if (!TemplateComponent) {
    // ToDo: Handle Error
    throw new Error(`Template component not found in ${templateEntry}`);
  }

  const element = (
    <TemplateComponent>
      <AppComponent />
    </TemplateComponent>
  );

  return renderToPipeableStream(element);
};

import type { FC } from "react";
import { renderToPipeableStream } from "react-dom/server";

import type { SSRRenderContext } from "@velnora/runtime";
import type { WithDefault } from "@velnora/types";
import { capitalize } from "@velnora/utils";

export const render = async (ctx: SSRRenderContext) => {
  const templateEntry = ctx.template.getEntryPoint();
  const appModuleName = capitalize(ctx.entity.app.name);
  const templateModuleName = capitalize(ctx.template.name);

  const [appModule, templateModule] = await Promise.all([
    ctx.entity.app.config.ssr
      ? ctx.route.component<WithDefault<FC, Record<string, FC>>>()
      : Promise.resolve({ default: () => <></> } as WithDefault<FC, Record<string, FC>>),
    templateEntry ? ctx.entity.viteRunner.runner.import(templateEntry) : Promise.resolve({})
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

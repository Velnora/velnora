import { type ViteDevServer, isRunnableDevEnvironment } from "vite";

import { appCtx } from "@velnora/runtime";
import type {
  TemplateOptions as ITemplateOptions,
  TemplateRenderContext as ITemplateRenderContext,
  RegisteredTemplate
} from "@velnora/types";
import { ClassExtensions, ClassGetterSetter, ClassRawValues } from "@velnora/utils";

import type { NonFunction } from "../../types/non-function";
import { BaseClass } from "../base-class";
import type { FrameworkContext } from "../framework.context";
import { TemplateRenderContext } from "./template/template-render.context";

@ClassRawValues()
@ClassExtensions()
export class TemplateOptions extends BaseClass<FrameworkContext> implements ITemplateOptions {
  @ClassGetterSetter()
  declare render: ITemplateOptions["render"];

  getContext(template: RegisteredTemplate, viteServer: ViteDevServer) {
    const t = appCtx.projectStructure.template.templates.get(template.name);
    if (!t) {
      throw new Error(`Template ${template.name} not found`);
    }

    const ssrEnv = viteServer.environments.ssr;
    if (!isRunnableDevEnvironment(ssrEnv)) {
      throw new Error("SSR environment is not runnable");
    }

    const context = new TemplateRenderContext(this);
    Object.assign<TemplateRenderContext, NonFunction<ITemplateRenderContext>>(context, {
      template: t,
      vite: viteServer,
      client: viteServer.environments.client,
      server: ssrEnv
    });
    return context;
  }
}

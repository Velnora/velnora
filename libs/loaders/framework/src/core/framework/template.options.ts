import { type ViteDevServer, isRunnableDevEnvironment } from "vite";

import { appCtx } from "@fluxora/runtime";
import type {
  TemplateOptions as ITemplateOptions,
  TemplateRenderContext as ITemplateRenderContext,
  RegisteredTemplate
} from "@fluxora/types";
import { ClassExtensions, ClassGetterSetter } from "@fluxora/utils";

import { ContainerBaseClass } from "../container-base-class";
import type { FrameworkContext } from "../framework.context";
import { TemplateRenderContext } from "./template/template-render.context";

type NonFunction<T> = T extends (...args: any[]) => any
  ? never
  : T extends object
    ? {
        [K in keyof T as T[K] extends (...args: any[]) => any ? never : K]: T[K];
      }
    : T;

@ClassExtensions()
export class TemplateOptions extends ContainerBaseClass<FrameworkContext> implements ITemplateOptions {
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

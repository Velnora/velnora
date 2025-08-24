import type { SSRRenderContext as ISSRRenderContext, RegisteredModule, VelnoraFramework } from "@velnora/types";
import { ClassExtensions, ClassRawValues, singleton } from "@velnora/utils";
import { Registry } from "@velnora/utils/node";

import { frameworkLogger } from "../../utils/logger/framework-logger";
import { RegisteredApp, appCtx } from "../app-ctx";
import { FrameworkContext } from "./framework.context";
import { SSRRenderContext } from "./ssr-render.context";

@ClassRawValues()
@ClassExtensions()
export class FrameworkRegistry extends Registry<VelnoraFramework, FrameworkContext> {
  constructor() {
    super("framework", FrameworkContext, frameworkLogger, true);
  }

  use(name: string, module: RegisteredModule) {
    const resolvedName = this.resolveName(name);
    const framework = this.registered.get(resolvedName);
    if (!framework) throw new Error(`Framework "${resolvedName}" is not registered.`);
    const context = super.use(name, module);
    Object.assign(context, framework);
    return context;
  }

  async getSSRRenderer(app: RegisteredApp) {
    const resolvedName = this.resolveName(app.config.framework);
    const ssrRenderer = await appCtx.vite
      .getSsr(app.name)
      .runner.import<typeof import("@velnora/framework-react/ssr")>(`${resolvedName}/ssr`);

    return (ssrRenderContext: SSRRenderContext) => {
      return ssrRenderer.render(ssrRenderContext);
    };
  }

  getSSRRenderContext(ssrRenderContext: ISSRRenderContext) {
    const ctx = new SSRRenderContext();
    Object.assign(ctx, ssrRenderContext);
    return ctx;
  }

  getClientRenderer(framework: string) {
    const name = this.resolveName(framework);
    if (!this.registered.has(name)) {
      throw new Error(`Framework "${name}" is not registered.`);
    }

    return `${name}/client`;
  }
}

export const frameworkRegistry = singleton(FrameworkRegistry);

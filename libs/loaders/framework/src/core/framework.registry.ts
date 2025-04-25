import { RegisteredApp, appCtx } from "@fluxora/runtime";
import type { FluxoraFramework, SSRRenderContext as ISSRRenderContext, RegisteredModule } from "@fluxora/types";
import { ClassExtensions, ClassRawValues, singleton } from "@fluxora/utils";
import { Registry } from "@fluxora/utils/node";

import { logger } from "../utils/logger";
import { FrameworkContext } from "./framework.context";
import { SSRRenderContext } from "./ssr-render.context";

@ClassRawValues()
@ClassExtensions()
export class FrameworkRegistry extends Registry<FluxoraFramework, FrameworkContext> {
  constructor() {
    super("framework", FrameworkContext, logger, true);
  }

  use(name: string, module: RegisteredModule) {
    const resolvedName = this.resolveName(name);
    const framework = this.registered.get(resolvedName);
    if (!framework) throw new Error(`Framework "${resolvedName}" is not registered.`);
    const context = super.use(name, module);
    Object.assign(context, framework);
    return context;
  }

  async getSSRRenderer(app: RegisteredApp, name: string) {
    const resolvedName = this.resolveName(name);
    const ssrRenderer = await appCtx.vite
      .getSsr(app.name)
      .runner.import<typeof import("@fluxora/framework-react/ssr")>(`${resolvedName}/ssr`);

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

export const frameworkRegistry = singleton("__FRAMEWORK_REGISTRY__", () => new FrameworkRegistry());

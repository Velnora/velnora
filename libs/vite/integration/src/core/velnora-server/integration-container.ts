import type {
  AppModuleGraph,
  IntegrationContainer as BaseIntegrationContainer,
  Integration,
  Package,
  Stage,
  VelnoraConfig
} from "@velnora/schemas";

import { debug } from "../../utils/debug";
import type { AppContext } from "../context/app-context";

export class IntegrationContainer implements BaseIntegrationContainer {
  private readonly debug = debug.extend("integration-container");
  private readonly packageIntegrations = new Map<string, Integration[]>();

  constructor(
    private readonly config: VelnoraConfig,
    private readonly appContext: AppContext
  ) {}

  configure(entry: Package) {
    this.debug("running configure stage for package: %O", { name: entry.name });
    this.runHook("configure", entry);
  }

  scaffold(entry: Package) {
    this.debug("running scaffold stage for package: %O", { name: entry.name });
    this.runHook("scaffold", entry);
  }

  build(entry: Package) {
    this.debug("running build stage for package: %O", { name: entry.name });
    this.runHook("build", entry);
  }

  runtime(entry: Package) {
    this.debug("running runtime stage for package: %O", { name: entry.name });
    this.runHook("runtime", entry);
  }

  private runHook<THookName extends Stage>(hookName: THookName, entry: Package) {
    this.debug("resolving integrations for hook: %O", { hookName, packageName: entry.name });
    const integrations = this.getIntegrationsFor(entry);

    for (const integration of integrations) {
      const hook = integration[hookName];
      if (hook) {
        const ctx = this.appContext.getOrCreateContext(entry);
        this.debug("invoking integration hook: %O", { hookName, packageName: entry.name });
        hook(ctx);
      }
    }
  }

  private getIntegrationsFor(entry: Package): Integration[] {
    const cached = this.packageIntegrations.get(entry.name);
    if (cached) {
      this.debug("using cached integrations for package: %O", { name: entry.name, count: cached.length });
      return cached;
    }

    const allIntegrations = this.config.integrations || [];
    const ctx = this.appContext.getOrCreateContext(entry);
    const applicableIntegrations = allIntegrations.filter(integration =>
      integration.apply ? integration.apply(ctx) : true
    );

    this.debug("resolved applicable integrations for package: %O", {
      name: entry.name,
      totalIntegrations: allIntegrations.length,
      applicable: applicableIntegrations.length
    });

    this.packageIntegrations.set(entry.name, applicableIntegrations);
    return applicableIntegrations;
  }
}

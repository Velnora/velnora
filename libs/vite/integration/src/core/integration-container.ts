import type { Hookable } from "hookable";

import type { Hooks, Integration, Logger, Package, Router, Stage, VelnoraConfig } from "@velnora/types";

import { debug } from "../utils/debug";
import { ContextManager } from "./context-manager";
import type { ViteContainer } from "./vite-container";

export class IntegrationContainer {
  private readonly debug = debug.extend("integration-container");
  private readonly packageIntegrations = new Map<string, Integration[]>();

  private readonly contextManager: ContextManager;

  constructor(
    private readonly config: VelnoraConfig,
    router: Router,
    hooks: Hookable<Hooks>,
    viteContainer: ViteContainer,
    logger: Logger
  ) {
    this.contextManager = new ContextManager(viteContainer, router, logger);

    hooks.hook("integration:configure", async (entry: Package) => {
      this.debug("running configure stage for package: %O", { name: entry.name });
      await this.runHook("configure", entry);
    });

    hooks.hook("integration:scaffold", async (entry: Package) => {
      this.debug("running scaffold stage for package: %O", { name: entry.name });
      await this.runHook("scaffold", entry);
    });

    hooks.hook("integration:build", async (entry: Package) => {
      this.debug("running build stage for package: %O", { name: entry.name });
      await this.runHook("build", entry);
    });

    hooks.hook("integration:runtime", async (entry: Package) => {
      this.debug("running runtime stage for package: %O", { name: entry.name });
      await this.runHook("runtime", entry);
    });
  }

  configure(entry: Package) {
    return this.runHook("configure", entry);
  }

  scaffold(entry: Package) {
    return this.runHook("scaffold", entry);
  }

  build(entry: Package) {
    return this.runHook("build", entry);
  }

  runtime(entry: Package) {
    return this.runHook("runtime", entry);
  }

  private async runHook<THookName extends Stage>(hookName: THookName, entry: Package) {
    this.debug("resolving integrations for hook: %O", { hookName, packageName: entry.name });
    const integrations = this.getIntegrationsFor(entry);

    const hookedPromises = integrations.map(async integration => {
      const hook = integration[hookName];
      if (hook) {
        const ctx = this.contextManager.getFor(entry, integration);
        this.debug("invoking integration hook: %O", { hookName, packageName: entry.name });
        await hook(ctx);
      }
    });

    const hookResults = await Promise.allSettled(hookedPromises);
    const rejectedResults = hookResults.filter(result => result.status === "rejected");

    if (rejectedResults.length > 0) {
      this.debug("some integration hooks failed for package: %O", {
        hookName,
        packageName: entry.name,
        rejectedCount: rejectedResults.length
      });

      throw new AggregateError(
        rejectedResults.map(result => result.reason as Error),
        `One or more integration hooks failed during '${hookName}' stage for package '${entry.name}'.`
      );
    }

    this.debug("completed integration hook: %O", { hookName, packageName: entry.name, results: hookResults });
  }

  private getIntegrationsFor(entry: Package): Integration[] {
    const cached = this.packageIntegrations.get(entry.name);
    if (cached) {
      this.debug("using cached integrations for package: %O", { name: entry.name, count: cached.length });
      return cached;
    }

    const allIntegrations = this.config.integrations || [];
    const applicableIntegrations = allIntegrations.filter(integration =>
      integration.apply ? integration.apply(this.contextManager.getFor(entry, integration)) : true
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

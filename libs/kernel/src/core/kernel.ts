/**
 * @velnora-meta
 * type: author
 * author: MDReal
 */
import merge from "lodash.merge";

import type Http from "http";

import h3 from "@velnora/adapter-h3";
import type { DevCommandOptions } from "@velnora/commands";
import node from "@velnora/runtime-node";
import {
  type AdapterUnit,
  type ConfigEnv,
  type IntegrationUnit,
  type Project,
  type RuntimeUnit,
  UnitKind,
  type VelnoraConfig,
  type VelnoraUnit
} from "@velnora/types";
import { GlobalRegistry, UNITS_REGISTRY, detectProjects, detectWorkspace, parseConfig } from "@velnora/utils";

import { BaseContext } from "../helper/base-context";

/**
 * The Kernel is the Layer 0 runtime orchestrator for Velnora.
 *
 * It wires together workspace/project discovery and boots the Host HTTP server
 * so that every discovered project is served under its own URL namespace.
 */
export class Kernel {
  private root!: string;
  private projects: Project[] = [];
  private config: VelnoraConfig | null = null;

  private server: Http.Server | null = null;

  private readonly registry = GlobalRegistry.use(UNITS_REGISTRY);
  private readonly runtimeStoreRegistry = GlobalRegistry.use<RuntimeUnit>(UNITS_REGISTRY.store, UnitKind.RUNTIME);
  private readonly adapterStoreRegistry = GlobalRegistry.use<AdapterUnit>(UNITS_REGISTRY.store, UnitKind.ADAPTER);
  private readonly integrationStoreRegistry = GlobalRegistry.use<IntegrationUnit>(
    UNITS_REGISTRY.store,
    UnitKind.INTEGRATION
  );

  private get configDefaults(): VelnoraConfig {
    return { integrations: [] };
  }

  private get configEnv(): ConfigEnv {
    return { command: "serve", mode: "development" };
  }

  /**
   * Discover the workspace root and all projects within it.
   *
   * 1. Walks up from `process.cwd()` to find the nearest `package.json` with `workspaces`.
   * 2. Resolves every workspace glob into concrete `Project` entries.
   */
  async init() {
    const { root, rootPackageJson } = await detectWorkspace(process.cwd());

    this.root = root;
    process.chdir(root);

    [this.config, this.projects] = await Promise.all([
      parseConfig<VelnoraConfig>(root),
      detectProjects(rootPackageJson)
    ]);

    this.config = merge(this.configDefaults, this.config);
    BaseContext.setConfig(this.config);
  }

  /**
   * Boot the Host HTTP server with the discovered projects.
   *
   * Must be called **after** `init()`.
   */
  async boot(options?: DevCommandOptions) {
    options ||= { port: 3000, host: "localhost" };
    if (this.projects.length === 0) {
      throw new Error("[Velnora] No projects discovered. Did you call kernel.init() first?");
    }

    await this.configureIntegrations();
    const runtimes = this.runtimeStoreRegistry.getAll<RuntimeUnit>();

    for (const project of this.projects) {
      const relatedRuntimesPromises = await Array.fromAsync(
        runtimes.map(async runtime => [await runtime.detect(project.root), runtime] as const)
      );
      const relatedRuntimes = relatedRuntimesPromises.filter(([detected]) => detected).map(([, runtime]) => runtime);

      if (relatedRuntimes.length === 0) {
        console.warn(
          `[Velnora] No runtimes detected for project ${project.displayName} at ${project.path}. This project will be run in same runtime as the Velnora itself`
        );
      } else if (relatedRuntimes.length === 1) {
      } else {
        console.warn(
          `[Velnora] Multiple runtimes detected for project ${project.displayName} at ${project.path}. This is not currently supported, so the first detected runtime will be used. Detected runtimes: ${relatedRuntimes
            .map(runtime => runtime.name)
            .join(", ")}.`
        );
      }
    }

    // console.log(BaseContext);

    // const http = this.registry.get<BaseHttpAdapter>("http");
    // if (!http)
    //   throw new Error("[Velnora] No HTTP adapter registered. Did you configure an integration that provides one?");
    //
    // for (const project of this.projects) {
    //   console.log(`  → ${project.displayName} at ${project.path}`);
    // }
    //
    // this.server = await http.listen(options.port, options.host);
    // if (!this.server)
    //   throw new Error("[Velnora] Failed to start HTTP server: adapter did not return a server instance.");
    // const address = this.server.address();
    //
    // if (!address) {
    //   throw new Error("[Velnora] Failed to start HTTP server: unable to determine listening address.");
    // } else if (typeof address === "string") {
    //   console.log(`[Velnora] Host running at ${address}`);
    // } else {
    //   const { port, address: host } = address;
    //   const url = `http://${host}:${port}`;
    //   console.log(`[Velnora] Host running at ${url}`);
    // }
    //
    // for (const project of this.projects) {
    //   console.log(`  → ${project.displayName} at ${project.path}`);
    // }
  }

  /**
   * Gracefully shut down the Host server.
   */
  async shutdown() {
    if (this.server) {
      const { promise, resolve, reject } = Promise.withResolvers<void>();
      this.server.close(err => {
        if (err) reject(err);
        else resolve();
      });
      await promise;
      this.server = null;
    }
  }

  /** The discovered workspace root (available after `init()`). */
  get workspaceRoot() {
    return this.root;
  }

  /** The discovered projects (available after `init()`). */
  get discoveredProjects(): ReadonlyArray<Project> {
    return this.projects;
  }

  private async configureIntegrations() {
    const { integrations: units = [] } = this.config || {};
    const fetchedUnits: VelnoraUnit[] = [];

    for (const unit of units) {
      fetchedUnits.push(typeof unit === "function" ? unit(this.configEnv) : unit);
    }

    const runtimes = fetchedUnits.filter(unit => unit.kind === UnitKind.RUNTIME);
    const adapters = fetchedUnits.filter(unit => unit.kind === UnitKind.ADAPTER);
    const integrations = fetchedUnits.filter(unit => unit.kind === UnitKind.INTEGRATION);

    if (!runtimes.length) runtimes.push(typeof node === "function" ? node(this.configEnv) : node);
    if (!adapters.length) adapters.push(typeof h3 === "function" ? h3(this.configEnv) : h3);

    await BaseContext.batch(async () => {
      await Array.fromAsync(
        runtimes.map(async runtime => {
          await runtime.configure?.(BaseContext.for(runtime));
          this.runtimeStoreRegistry.set(runtime.name, runtime);
        })
      );

      await Array.fromAsync(
        adapters.map(async adapter => {
          await adapter.configure?.(BaseContext.for(adapter));
          this.adapterStoreRegistry.set(adapter.name, adapter);
        })
      );
      await Array.fromAsync(
        integrations.map(async integration => {
          await integration.configure?.(BaseContext.for(integration));
          this.integrationStoreRegistry.set(integration.name, integration);
        })
      );
    });
  }
}

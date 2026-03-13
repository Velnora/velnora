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
import {
  CONFIG_REGISTRY,
  GlobalRegistry,
  NoAdapterProvidedException,
  NoRuntimeProvidedException,
  UNITS_REGISTRY,
  detectProjects,
  detectWorkspace,
  parseConfig
} from "@velnora/utils";
import { DepGraph } from "@velnora/utils";

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

  private readonly configRegistry = GlobalRegistry.use(CONFIG_REGISTRY);

  private readonly registry = GlobalRegistry.use(UNITS_REGISTRY);
  private readonly runtimeStoreRegistry = GlobalRegistry.use<RuntimeUnit>(UNITS_REGISTRY.store, UnitKind.RUNTIME);
  private readonly adapterStoreRegistry = GlobalRegistry.use<AdapterUnit>(UNITS_REGISTRY.store, UnitKind.ADAPTER);
  private readonly integrationStoreRegistry = GlobalRegistry.use<IntegrationUnit>(
    UNITS_REGISTRY.store,
    UnitKind.INTEGRATION
  );

  private readonly integrationsGraph = new DepGraph<VelnoraUnit>(unit => ({
    key: unit.name,
    children: [...(unit.required || []), ...(unit.optional || [])]
  }));

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

    const integrations = (this.config.integrations || []).map(integration =>
      typeof integration === "function" ? integration(this.configEnv) : integration
    );
    this.integrationsGraph.addMany(integrations);

    if (!this.integrationsGraph.has(unit => unit.kind === UnitKind.RUNTIME))
      this.integrationsGraph.add(typeof node === "function" ? node(this.configEnv) : node);

    if (!this.integrationsGraph.has(unit => unit.kind === UnitKind.ADAPTER))
      this.integrationsGraph.add(typeof h3 === "function" ? h3(this.configEnv) : h3);
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

    await this.bootIntegrations();
    this.bootHostAdapter();

    const runtimes = this.integrationsGraph.filter(unit => unit.kind === UnitKind.RUNTIME);

    for (const project of this.projects) {
      const runtime = await runtimes.filter(async runtime => await runtime.detect(project.root));
      const nodes = runtime.toArray();

      if (!nodes.length) {
        throw new NoRuntimeProvidedException(
          `No runtimes detected for project ${project.displayName} at ${project.path}. This project cannot be run.`
        );
      }

      const detected = nodes[0];
      if (nodes.length > 1) {
        console.warn(
          `[Velnora] Multiple runtimes detected for project ${project.displayName} at ${project.path}. This is not currently supported, so the first detected runtime will be used. Detected runtimes: ${nodes
            .map(runtime => runtime.name)
            .join(", ")}.`
        );
      }

      console.log("detected runtime for %s project", project.name, detected);
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

  private async bootIntegrations() {
    const promises = this.integrationsGraph.map(async unit => {
      await unit.configure?.(BaseContext.for(unit));
    });
    await Promise.all(promises);
  }

  private bootHostAdapter() {
    const adapters = this.integrationsGraph.filter(unit => unit.kind === UnitKind.ADAPTER);

    if (adapters.size === 0) {
      throw new NoAdapterProvidedException(
        "No adapters detected. Did you configure an integration that provides an adapter?"
      );
    }

    if (adapters.size > 1) {
      console.warn(
        `[Velnora] Multiple adapters detected. This is not currently supported, so the first detected adapter will be used. Detected adapters: ${adapters
          .toArray()
          .map(adapter => adapter.name)
          .join(", ")}.`
      );
    }

    const adapter = adapters.toArray()[0]!;
    console.log(`[Velnora] Booting host with adapter: ${adapter.name}`);
    const http = BaseContext.for(adapter).query("http");
    this.configRegistry.set("http", http);
  }
}

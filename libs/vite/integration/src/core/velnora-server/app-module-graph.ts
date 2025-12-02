import type { PackageJson, Promisable } from "type-fest";

import type { Node, AppModuleGraph as VelnoraAppModuleGraph, VelnoraConfig } from "@velnora/schemas";

import { debug } from "../../utils/debug";
import { Package } from "../package";
import { AppConfigManager } from "./app-config-manager";

export class AppModuleGraph implements VelnoraAppModuleGraph {
  private readonly debug = debug.extend("module-graph");
  readonly nodes = new Set<string>();
  readonly nodeMeta = new Map<string, Node>();
  readonly edges = new Map<string, Set<string>>();

  private readonly appConfigManager = new AppConfigManager();

  constructor(private readonly config: VelnoraConfig) {}

  addModule(root: string, packageJson: PackageJson) {
    const pkg = new Package(root, packageJson, this.appConfigManager, this.config);
    const moduleName = pkg.id;
    this.debug("add-module adding module: %O", { moduleName });

    const existedBefore = this.nodes.has(moduleName);
    this.nodes.add(moduleName);

    this.debug("add-module module added: %O", {
      moduleName,
      existedBefore,
      totalNodes: this.nodes.size
    });

    const meta = { package: pkg };
    this.nodeMeta.set(moduleName, meta);

    this.debug("add-meta metadata set: %O", { moduleName, existedBefore, meta });

    return this;
  }

  addDependency(fromModule: string, toModule: string) {
    this.debug("add-dependency adding dependency: %O", { fromModule, toModule });

    const fromBefore = this.hasModule(fromModule);
    const toBefore = this.hasModule(toModule);

    if (!fromBefore) throw new Error(`Module ${fromModule} does not exist in the graph.`);
    if (!toBefore) throw new Error(`Module ${toModule} does not exist in the graph.`);

    if (!this.edges.has(fromModule)) {
      this.edges.set(fromModule, new Set());
      this.debug("add-dependency initialized dependency set: %O", { fromModule });
    }

    const deps = this.edges.get(fromModule)!;
    const existedBefore = deps.has(toModule);
    deps.add(toModule);

    this.debug("add-dependency dependency added: %O", {
      fromModule,
      toModule,
      existedBefore,
      totalDepsFromModule: deps.size
    });

    return this;
  }

  perNode(callback: (moduleName: string, meta: Node) => void): this;
  perNode(callback: (moduleName: string, meta: Node) => Promise<void>): Promise<this>;
  perNode(callback: (moduleName: string, meta: Node) => Promisable<void>) {
    this.debug("per-node iterating over modules: %O", {
      totalNodes: this.nodes.size,
      totalMeta: this.nodeMeta.size
    });
    let isPromise = false;
    const promises: Promise<void>[] = [];

    for (const moduleName of this.nodes) {
      const meta = this.nodeMeta.get(moduleName);

      if (!meta) {
        this.debug("per-node missing metadata for module: %O", { moduleName });
        throw new Error(`Meta for module ${moduleName} does not exist in the graph.`);
      }

      this.debug("per-node invoking callback: %O", { moduleName });
      const result = callback(moduleName, meta);
      isPromise = isPromise || result instanceof Promise;
      if (isPromise) {
        promises.push(Promise.resolve(result));
      }
      this.debug("per-node callback finished: %O", { moduleName });
    }

    this.debug("per-node iteration complete");
    return isPromise ? Promise.all(promises).then(() => this) : this;
  }

  getDependencies(moduleName: string) {
    this.debug("get-dependencies retrieving dependencies: %O", { moduleName });

    const deps = this.edges.get(moduleName);

    this.debug("get-dependencies dependencies retrieved: %O", {
      moduleName,
      hasDependencies: !!deps,
      dependencyCount: deps?.size ?? 0
    });

    return deps;
  }

  hasModule(moduleName: string) {
    const result = this.nodes.has(moduleName);

    this.debug("has-module module existence check: %O", { moduleName, result });
    return result;
  }

  hasDependency(fromModule: string, toModule: string) {
    const result = this.edges.get(fromModule)?.has(toModule) ?? false;

    this.debug("has-dependency dependency existence check: %O", {
      fromModule,
      toModule,
      result
    });
    return result;
  }

  removeModule(moduleName: string) {
    this.debug("remove-module removing module: %O", { moduleName });

    const existed = this.nodes.delete(moduleName);
    const hadOutgoing = this.edges.has(moduleName);
    this.edges.delete(moduleName);

    const removedIncoming: string[] = [];
    for (const [from, deps] of this.edges) {
      if (deps.delete(moduleName)) {
        removedIncoming.push(from);
        if (deps.size === 0) {
          this.edges.delete(from);
        }
      }
    }

    this.debug("remove-module module removed: %O", {
      moduleName,
      existed,
      hadOutgoing,
      removedIncoming,
      totalNodes: this.nodes.size
    });

    return this;
  }

  removeDependency(fromModule: string, toModule: string) {
    this.debug("remove-dependency removing dependency: %O", { fromModule, toModule });

    const deps = this.edges.get(fromModule);
    if (!deps) {
      this.debug("remove-dependency no dependencies found for module: %O", { fromModule });
      return this;
    }

    const existed = deps.delete(toModule);

    if (deps.size === 0) {
      this.edges.delete(fromModule);
      this.debug("remove-dependency removed empty dependency set: %O", { fromModule });
    }

    this.debug("remove-dependency dependency removed: %O", {
      fromModule,
      toModule,
      existed,
      remaining: deps.size
    });

    return this;
  }
}

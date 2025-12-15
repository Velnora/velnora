import { readFileSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";

import { glob } from "glob";
import type { PackageJson, Promisable } from "type-fest";

import type { VelnoraConfig } from "@velnora/types";

import { debug } from "../utils/debug";
import { Node } from "./node";
import { Savable } from "./savable";

export class ModuleGraph extends Savable<ModuleGraph> {
  private readonly nodeNameMap = new Map<string, Node>();
  private readonly nodes = new Set<Node>();
  private readonly edges = new Map<Node, Set<Node>>();

  constructor(private readonly config: VelnoraConfig) {
    super(resolve(config.cacheDir, "module-graph.json"), debug.extend("module-graph"));
  }

  indexWorkspace() {
    return this.withPersistence(async () => {
      if (this.nodes.size > 0) {
        this.debug("index-workspace module graph loaded from cache with %d nodes", this.nodes.size);
        return;
      }

      const debug = this.debug.extend("index-workspace");
      debug("starting parse packages");

      const pkgJsonFile = resolve(this.config.root, "package.json");
      debug("resolved root package.json path: %O", { pkgJsonFile });

      const packageJson = JSON.parse(await readFile(pkgJsonFile, "utf-8")) as PackageJson;
      debug("loaded root package.json: %O", { hasWorkspaces: !!packageJson.workspaces });

      const workspaces = Array.isArray(packageJson.workspaces)
        ? packageJson.workspaces
        : packageJson.workspaces?.packages || [];
      debug("resolved workspaces: %O", { workspaces });

      const packages = await glob(
        workspaces.map(pkg => `${pkg}/package.json`),
        { absolute: true, cwd: this.config.root }
      );
      debug("matched workspace package.json files: %O", { packages });

      const pkgs = packages
        .map(pkgPath => {
          debug("found workspace package: %O", { pkgPath });

          const root = dirname(pkgPath);
          debug("resolved package root directory: %O", { pkgPath, root });

          const pkgJson = JSON.parse(readFileSync(pkgPath, "utf-8")) as PackageJson;
          debug("imported package.json: %O", {
            pkgPath,
            hasName: !!pkgJson.name
          });

          if (!pkgJson.name) {
            debug("package has no name, skipping: %O", { pkgPath });
            return;
          }

          return { packageJson: pkgJson, root };
        })
        .filter(p => !!p);

      debug("successfully parsed packages: %O", {
        count: pkgs.length,
        names: pkgs.map(p => p.packageJson.name)
      });

      pkgs.forEach(pkg => {
        debug("adding package to module graph: %O", { name: pkg.packageJson.name, root: pkg.root });

        const node = new Node(pkg.root, pkg.packageJson, this.config);
        this.nodes.add(node);
        this.nodeNameMap.set(node.name, node);
      });

      debug("finished parsing infrastructure: %O", {
        totalModules: pkgs.length
      });
    });
  }

  updateNode(node: string | Node, cb: (node: Node) => void) {
    const targetNode = typeof node === "string" ? this.nodeNameMap.get(node) : node;
    if (!targetNode) throw new Error(`Node not found: ${typeof node === "string" ? node : node.name}`);
    cb(targetNode);
  }

  forEach(callback: (module: Node) => Promise<unknown>): Promise<this>;
  forEach(callback: (module: Node) => unknown): this;
  forEach(cb: (node: Node) => Promisable<unknown>) {
    const results = Array.from(this.nodes).map(node => cb(node));
    if (results.some(r => r instanceof Promise)) {
      return Promise.all(results.map(r => Promise.resolve(r))).then(() => this);
    }
    return this;
  }

  toJSON() {
    const nodes = Array.from(this.nodes).map(node => node.toJSON());
    const edges: Record<string, string[]> = {};
    this.edges.forEach((targets, source) => {
      edges[source.name] = Array.from(targets).map(target => target.name);
    });
    return { $v: 1, nodes, edges };
  }

  protected loadData(data: ModuleGraph) {
    data.nodes.forEach(nodeData => {
      const node = new Node(nodeData.root, nodeData.packageJson, this.config);
      this.nodes.add(node);
      this.nodeNameMap.set(node.name, node);
    });
  }
}

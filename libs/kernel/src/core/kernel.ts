/**
 * @velnora-meta
 * type: author
 * author: MDReal
 */

import merge from "lodash.merge";

import type { DevCommandOptions } from "@velnora/commands";
import { Host } from "@velnora/host";
import node from "@velnora/runtime-node";
import type { Project, VelnoraConfig } from "@velnora/types";
import { detectProjects, detectWorkspace, parseConfig } from "@velnora/utils";

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
  private host: Host | null = null;

  private get configDefaults(): VelnoraConfig {
    return { integrations: [node] };
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
  }

  /**
   * Boot the Host HTTP server with the discovered projects.
   *
   * Must be called **after** `init()`.
   */
  async bootHost(options?: DevCommandOptions) {
    if (this.projects.length === 0) {
      throw new Error("[Velnora] No projects discovered. Did you call kernel.init() first?");
    }

    this.host = new Host(this.projects, options);

    const listener = await this.host.listen();
    const url = listener.url;

    console.log(`[Velnora] Host running at ${url}`);
    console.log(`[Velnora] Serving ${this.projects.length} project(s):`);

    for (const project of this.projects) {
      console.log(`  → ${project.displayName} at ${project.path}`);
    }
  }

  /**
   * Gracefully shut down the Host server.
   */
  async shutdown() {
    if (this.host) {
      await this.host.close();
      this.host = null;
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
}

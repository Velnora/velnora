import { defu } from "defu";
import { H3 } from "h3";
import { toNodeHandler } from "h3/node";
import { type Listener, listen } from "listhen";

import type { DevCommandOptions } from "@velnora/commands";
import type { Project, RequiredKeys } from "@velnora/types";

const DEFAULT_OPTIONS: RequiredKeys<DevCommandOptions, "host" | "port"> = {
  port: 3000,
  host: "localhost"
};

export class Host {
  private readonly app: H3;
  private listener: Listener | null = null;
  private options: RequiredKeys<DevCommandOptions, "host" | "port">;

  constructor(
    private projects: Project[],
    options?: DevCommandOptions
  ) {
    this.options = defu(options ?? {}, DEFAULT_OPTIONS);
    this.app = new H3();

    this.registerRoutes();
  }

  /**
   * Register a route for each discovered project.
   * Each project gets a base path at `/{project.name}`.
   */
  private registerRoutes() {
    for (const project of this.projects) {
      this.app.get(`${project.path}/**`, () => ({
        project: project.name,
        displayName: project.displayName,
        root: project.root,
        status: "registered"
      }));
    }

    // Root route: list all registered projects
    this.app.get("/", () => ({
      velnora: true,
      projects: this.projects.map(project => ({
        name: project.name,
        displayName: project.displayName,
        path: project.path
      }))
    }));
  }

  /**
   * Start the HTTP server.
   */
  async listen() {
    this.listener = await listen(toNodeHandler(this.app), {
      port: this.options.port,
      hostname: this.options.host,
      showURL: false
    });

    return this.listener;
  }

  /**
   * Gracefully shut down the server.
   */
  async close() {
    if (this.listener) {
      await this.listener.close();
      this.listener = null;
    }
  }
}

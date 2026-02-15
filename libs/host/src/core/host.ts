import { statSync } from "node:fs";
import { readFile } from "node:fs/promises";
import { extname } from "node:path";

import { defu } from "defu";
import type { EventHandlerRequest, H3Event } from "h3";
import { H3, defineEventHandler } from "h3";
import { serveStatic, toNodeHandler } from "h3/node";
import { type Listener, listen } from "listhen";

import type { DevCommandOptions } from "@velnora/commands";
import type { Project, RequiredKeys } from "@velnora/types";

import { MIME_TYPES } from "../utils/mime-type";
import { resolveStaticFile } from "../utils/resolve-static-file";

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
   * Each project gets a base path at `/{project.path}`.
   */
  private registerRoutes() {
    for (const project of this.projects) {
      this.app.get(
        `${project.path}/__json`,
        defineEventHandler(() => ({
          project: project.name,
          displayName: project.displayName,
          root: project.root,
          status: "registered"
        }))
      );

      this.app.get(
        `${project.path}/**`,
        // ToDo: Replace with integration when integrations will be supported
        defineEventHandler(event =>
          serveStatic(event, {
            getContents: id => this.getStaticContents(project, id, event),
            getMeta: id => this.getStaticMeta(project, id)
          })
        )
      );
    }

    // Root route: list all registered projects
    this.app.get(
      "/",
      defineEventHandler(() => ({
        velnora: true,
        projects: this.projects.map(project => ({
          name: project.name,
          displayName: project.displayName,
          path: project.path
        }))
      }))
    );
  }

  private getStaticContents(project: Project, id: string, event: H3Event<EventHandlerRequest>) {
    const file = resolveStaticFile(project, id);
    if (!file) return undefined;

    return readFile(file)
      .then(contents => contents.toString("utf-8"))
      .then(contents => {
        if (file.endsWith(".html")) {
          let result: string;
          const isTagPresent = /<base\s+href=/.test(contents);
          if (isTagPresent) {
            result = contents.replace(/<base\s+href="[^"]*"\s*\/?>/i, `<base href="${project.path}/" />`);
          } else {
            const baseTag = `<base href="${project.path}/" />`;
            result = contents.replace(/<head>/i, `<head>${baseTag}`);
          }
          event.res.headers.set("Content-Length", Buffer.byteLength(result, "utf-8").toString());
          return result;
        }
        return contents;
      });
  }

  private getStaticMeta(project: Project, id: string) {
    const file = resolveStaticFile(project, id);
    if (!file) return;

    const stat = statSync(file);
    const ext = extname(file);

    return {
      type: MIME_TYPES[ext] || "application/octet-stream",
      size: stat.size,
      mtime: stat.mtime
    };
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

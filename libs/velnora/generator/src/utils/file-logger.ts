import { existsSync } from "node:fs";

import pc from "picocolors";

import { Emojis } from "@velnora/logger";
import { appCtx } from "@velnora/runtime";
import type { WithStringConstructor } from "@velnora/types";

import { logger } from "./logger";

export class FileLogger {
  private readonly fileExistsMap = new Map<string, boolean>();

  constructor(private readonly root: string) {}

  auto(file: WithStringConstructor) {
    if (this.fileExistsMap.has(file.$raw)) {
      this.updated(file);
      return;
    }
    if (existsSync(file.$raw)) {
      this.created(file);
      this.fileExistsMap.set(file.$raw, true);
      return;
    }
    this.removed(file);
    this.fileExistsMap.set(file.$raw, false);
  }

  created(file: WithStringConstructor) {
    const coloredPath = this.formatColoredPath(file.$raw);
    this.fileExistsMap.set(file.$raw, true);
    logger.success(Emojis.success, coloredPath, pc.greenBright("created"));
  }

  updated(file: WithStringConstructor) {
    const coloredPath = this.formatColoredPath(file.$raw);
    logger.success(Emojis.update, coloredPath, pc.yellow("updated"));
  }

  removed(file: WithStringConstructor) {
    const coloredPath = this.formatColoredPath(file.$raw);
    this.fileExistsMap.set(file.$raw, false);
    logger.success(Emojis.delete, coloredPath, pc.redBright("removed"));
  }

  private formatColoredPath(raw: string): string | null {
    const path = raw.slice(this.root.length + 1);
    const [segment, ...segments] = path.split("/");
    const rel = segments.join("/");
    const prefix = pc.gray(segment + "/");

    const appsDir = appCtx.projectStructure.apps.rawRoot;
    const libsDir = appCtx.projectStructure.libs.rawRoot;
    const tmplDir = appCtx.projectStructure.template.rawRoot;

    if (rel.startsWith(appsDir)) {
      return prefix + this.colorAppPath(rel, appsDir);
    } else if (rel.startsWith(libsDir)) {
      return prefix + this.colorLibOrTemplatePath(rel, libsDir, true);
    } else if (rel.startsWith(tmplDir)) {
      return prefix + this.colorLibOrTemplatePath(rel, tmplDir, false);
    } else if (rel) {
      return prefix + pc.cyan(rel);
    } else {
      return pc.cyan(segment);
    }
  }

  private colorAppPath(rel: string, base: string): string {
    const path = rel.slice(base.length + 1);
    const [name, ...rest] = path.split("/");
    const kindIndex = rest.findIndex(x => x === "client" || x === "server");

    const segments = [pc.gray(base), pc.gray("/" + name)];

    if (kindIndex !== -1) {
      for (let i = 0; i < kindIndex; i++) {
        segments.push(pc.gray("/" + rest[i]));
      }
      const kind = rest[kindIndex];
      segments.push(pc.blue("/" + kind));
      for (let i = kindIndex + 1; i < rest.length; i++) {
        segments.push(pc.cyan("/" + rest[i]));
      }
    } else {
      for (const part of rest) {
        segments.push(pc.cyan("/" + part));
      }
    }

    return segments.join("");
  }

  private colorLibOrTemplatePath(rel: string, base: string, isLib: boolean) {
    const path = rel.slice(base.length + 1);
    const [name, ...rest] = path.split("/");

    const segments: string[] = [pc.gray(base)];

    if (isLib) segments.push(pc.gray("/" + name));
    else rest.unshift(name);

    for (const part of rest) {
      segments.push(pc.cyan("/" + part));
    }

    return segments.join("");
  }
}

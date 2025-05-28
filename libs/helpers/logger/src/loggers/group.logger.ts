import { BaseClass, ClassExtensions } from "@velnora/utils";

import type { Logger } from "../types/logger";

@ClassExtensions()
export class GroupLogger extends BaseClass implements Logger {
  private readonly groupLogs = new Map<string, string[]>();

  debug(group: string, ...args: any[]) {
    this.addLog(group, "debug", ...args);
  }

  info(group: string, ...args: any[]) {
    this.addLog(group, "info", ...args);
  }

  log(group: string, ...args: any[]) {
    this.addLog(group, "log", ...args);
  }

  warn(group: string, ...args: any[]) {
    this.addLog(group, "warn", ...args);
  }

  error(group: string, ...args: any[]) {
    this.addLog(group, "error", ...args);
  }

  fatal(group: string, ...args: any[]) {
    this.addLog(group, "fatal", ...args);
  }

  protected addLog(group: string, level: string, ...args: any[]) {
    // this is basic implementation. ofc in rust side it will be more accurate and performant
    if (!this.groupLogs.has(group)) {
      this.groupLogs.set(group, []);
    }
    const logMessage = `[${level.toUpperCase()}] ${args.join(" ")}`;
    this.groupLogs.get(group)?.push(logMessage);
    // render logs group on screen. (this is just a placeholder, actual rendering will be done in rust side)
    // actual rendering is not just clean and console.log, its must be docker like behavior.
    // when scrolling terminal it gonna work in way how was before scrolling
  }
}

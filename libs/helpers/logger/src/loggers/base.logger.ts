import { BaseClass, ClassExtensions } from "@velnora/utils";

import type { Logger } from "../types/logger";

@ClassExtensions()
class BaseLogger extends BaseClass implements Logger {
  debug(...args: any[]) {}
  info(...args: any[]) {}
  log(...args: any[]) {}
  warn(...args: any[]) {}
  error(...args: any[]) {}
  fatal(...args: any[]) {}
}

export const createLogger = () => new BaseLogger();

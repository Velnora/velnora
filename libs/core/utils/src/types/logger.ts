import type { LogFunction } from "./log-function";

export interface Logger {
  debug: LogFunction;
  info: LogFunction;
  success: LogFunction;
  warn: LogFunction;
  error: LogFunction;
}

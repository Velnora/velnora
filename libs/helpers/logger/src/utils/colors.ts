import type { LogType } from "consola";
import pc from "picocolors";
import type { Formatter } from "picocolors/types";

const identity: Formatter = str => str?.toString() || "";

export const colors: Record<LogType, Formatter> = {
  silent: identity,
  fatal: pc.bgRed,
  error: pc.red,
  warn: pc.yellow,
  log: identity,
  info: pc.cyan,
  success: pc.green,
  fail: pc.red,
  ready: pc.green,
  start: pc.magenta,
  box: pc.bold,
  debug: pc.dim,
  trace: pc.magenta,
  verbose: pc.dim
};

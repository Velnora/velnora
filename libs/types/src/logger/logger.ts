/**
 * @velnora-meta
 * type: author
 * author: MDReal
 */
import type { LogContext } from "./log-context";
import type { LogLevel } from "./log-level";
import type { LogLevelNames } from "./log-level-names";

export interface Logger extends Record<LogLevelNames, (msg: unknown, context?: LogContext) => void> {
  /** Fixed context carried by this logger (from .extend) */
  readonly context: LogContext;

  /** Minimum level that this logger will actually emit */
  minLevel: LogLevel;

  setMinLevel(level: LogLevel): void;

  /** Low-level: log with explicit level */
  write(level: LogLevel, message: unknown, context?: LogContext): void;

  /**
   * Create a new logger that inherits current context
   * and adds / overrides the given fields.
   *
   * Example:
   *   const nestLog = rootLogger.extend({ logger: "velnora:nest", appId, side: "backend" })
   */
  extend(extra: LogContext): Logger;
}

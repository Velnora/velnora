import { merge } from "lodash";
import pc from "picocolors";

import { type LogContext, LogLevel, type Logger as VelnoraLogger } from "@velnora/schemas";

const PID_WIDTH = 6;
const LEVEL_WIDTH = 5;

export class Logger implements VelnoraLogger {
  minLevel: LogLevel = LogLevel.DEBUG;

  constructor(readonly context: LogContext) {}

  static create(ctx?: LogContext) {
    return new Logger(ctx ?? {});
  }

  setMinLevel(level: LogLevel) {
    this.minLevel = level;
  }

  write(level: LogLevel, message: unknown, context?: LogContext) {
    if (level < this.minLevel) return;

    const now = new Date();
    const prefix = this.formatPrefix(context); // [Velnora]
    const pid = this.formatPid(process.pid); // right-aligned, dim
    const timestamp = this.formatTimestamp(now); // 2025-11-25 21:54:58 (dim)
    const levelLabel = this.formatLevel(level); // right-aligned, colored
    const contextLabel = this.formatContext(context); // [Core] / [scope] / etc.
    const msg = this.stringify(message); // handles primitives / objects / errors

    const line =
      `${prefix} ${pid} - ${timestamp} ${levelLabel}` +
      (contextLabel ? ` [${contextLabel}]` : "") +
      (msg ? ` ${msg}` : "");

    const stream = this.getStreamForLevel(level);
    stream.write(line + "\n");
  }

  trace(msg: unknown, context?: LogContext) {
    this.write(LogLevel.TRACE, msg, context);
  }

  debug(msg: unknown, context?: LogContext) {
    this.write(LogLevel.DEBUG, msg, context);
  }

  log(msg: unknown, context?: LogContext) {
    this.write(LogLevel.LOG, msg, context);
  }

  warn(msg: unknown, context?: LogContext) {
    this.write(LogLevel.WARN, msg, context);
  }

  error(msg: unknown, context?: LogContext) {
    this.write(LogLevel.ERROR, msg, context);
  }

  fatal(msg: unknown, context?: LogContext) {
    this.write(LogLevel.FATAL, msg, context);
  }

  extend(context: LogContext) {
    const mergedLogContext = merge(this.context, context);
    const newLogger = new Logger(mergedLogContext);
    newLogger.setMinLevel(this.minLevel);
    return newLogger;
  }

  /**
   * [Velnora] – prefix, cyan + bold like Nest’s [Nest]
   */
  private formatPrefix(_context?: LogContext): string {
    const name = "Velnora"; // or this.prefix / context.app?.name, your choice
    return pc.cyan(pc.bold(`[${name}]`));
  }

  /**
   * PID column, right-aligned to 6 characters and dimmed.
   * Example: "  48756"
   */
  private formatPid(pid: number): string {
    const PID_WIDTH = 6;
    const raw = String(pid);
    const padded = raw.padStart(PID_WIDTH, " ");
    return pc.dim(padded);
  }

  /**
   * Timestamp as "YYYY-MM-DD HH:mm:SS", dimmed.
   * Fixed width → visually stable.
   */
  private formatTimestamp(date: Date): string {
    const pad = (n: number) => String(n).padStart(2, "0");

    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    const seconds = pad(date.getSeconds());

    const raw = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    return pc.dim(raw);
  }

  /**
   * Level as uppercase, width = 5, right-aligned and colored.
   * TRACE, DEBUG, INFO, WARN, ERROR, FATAL
   *
   * Example: " ERROR"
   */
  private formatLevel(level: LogLevel): string {
    let label: string;
    switch (level) {
      case LogLevel.TRACE:
        label = "TRACE";
        break;
      case LogLevel.DEBUG:
        label = "DEBUG";
        break;
      case LogLevel.LOG:
        label = "LOG";
        break;
      case LogLevel.WARN:
        label = "WARN";
        break;
      case LogLevel.ERROR:
        label = "ERROR";
        break;
      case LogLevel.FATAL:
        label = "FATAL";
        break;
      default:
        label = "LOG";
        break;
    }

    const padded = label.padStart(LEVEL_WIDTH, " ");

    // bright + bold, Nest-style “in your face”
    switch (level) {
      case LogLevel.TRACE:
        return pc.cyanBright(padded); // shining
      case LogLevel.DEBUG:
        return pc.magentaBright(padded);
      case LogLevel.LOG:
        return pc.greenBright(padded);
      case LogLevel.WARN:
        return pc.yellowBright(padded);
      case LogLevel.ERROR:
        return pc.redBright(padded);
      case LogLevel.FATAL:
        return pc.bgRedBright(pc.whiteBright(padded));
      default:
        return pc.bold(pc.whiteBright(padded));
    }
  }

  /**
   * Context column (optional).
   * Chooses something meaningful but not overkill from LogContext.
   *
   * Example: "[Core]" or "[http]" or "[velnora:nest]"
   */
  private formatContext(context?: LogContext): string {
    if (!context) return "";

    // Pick ONE main thing for CLI, to avoid eye-bleed.
    // Priority: app > logger > scope > runtime > side > env
    const name = context.app
      ? context.app.name
      : (context.logger ?? context.scope ?? context.runtime ?? context.side ?? context.env ?? null);

    if (!name) return "";

    return pc.yellowBright(`[${String(name)}]`);
  }

  /**
   * Converts any message type into a string.
   * Handles primitives, Error, objects, arrays, null/undefined.
   */
  private stringify(value: unknown): string {
    if (value === null || value === undefined) {
      return String(value);
    }

    // Error: show stack if possible
    if (value instanceof Error) {
      return value.stack ?? `${value.name}: ${value.message}`;
    }

    const t = typeof value;

    if (t === "string") {
      return value as string;
    }

    if (t === "number" || t === "boolean" || t === "bigint" || t === "symbol") {
      // eslint-disable-next-line @typescript-eslint/no-base-to-string
      return String(value);
    }

    // Functions – don’t dump body, just something short
    if (t === "function") {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
      const fn = value as Function;
      return `[Function${fn.name ? ` ${fn.name}` : ""}]`;
    }

    // Objects / arrays – try JSON, fall back gracefully
    try {
      return JSON.stringify(value, null, 2);
    } catch {
      return "[Unserializable value]";
    }
  }

  /**
   * Decide stdout vs stderr based on level.
   */
  private getStreamForLevel(level: LogLevel): NodeJS.WritableStream {
    if (level >= LogLevel.ERROR) {
      return process.stderr;
    }
    return process.stdout;
  }
}

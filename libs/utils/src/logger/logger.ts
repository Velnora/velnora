import merge from "lodash.merge";

import { format, inspect } from "node:util";

import pc from "picocolors";

import { type LogContext, LogLevel } from "@velnora/types";

import { LEVEL_COLOR, LEVEL_LABEL } from "../const";

const LEVEL_WIDTH = 5;
const PID_WIDTH = 6;

export class Logger {
  private _minLevel: LogLevel = LogLevel.DEBUG;

  constructor(readonly context: LogContext) {}

  static create(ctx: LogContext = {}) {
    return new Logger(ctx);
  }

  get minLevel() {
    return this._minLevel;
  }

  setMinLevel(level: LogLevel) {
    this._minLevel = level;
  }

  write(level: LogLevel, _ctx?: LogContext, ...args: unknown[]) {
    if (level < this._minLevel) return;

    const line =
      `${this.formatPrefix()} ${this.formatPid(process.pid)} - ` +
      `${this.formatTimestamp(new Date())} ${this.formatLevel(level)}` +
      (args.length ? ` ${this.stringify(level, args)}` : "");

    this.getStreamForLevel(level).write(line + "\n");
  }

  trace(msg: unknown, context?: LogContext) {
    this.write(LogLevel.TRACE, context, msg);
  }

  debug(msg: unknown, context?: LogContext) {
    this.write(LogLevel.DEBUG, context, msg);
  }

  log(msg: unknown, context?: LogContext) {
    this.write(LogLevel.LOG, context, msg);
  }

  warn(msg: unknown, context?: LogContext) {
    this.write(LogLevel.WARN, context, msg);
  }

  error(msg: unknown, context?: LogContext) {
    this.write(LogLevel.ERROR, context, msg);
  }

  fatal(msg: unknown, context?: LogContext) {
    this.write(LogLevel.FATAL, context, msg);
  }

  extend(context: LogContext) {
    const merged = merge(this.context, context);
    const next = new Logger(merged);
    next.setMinLevel(this._minLevel);
    return next;
  }

  /**
   * [Velnora] – prefix, cyan + bold like Nest’s [Nest]
   */
  private formatPrefix(_context?: LogContext) {
    const name = "Velnora";
    return this.colorize("prefix", `[${name}]`);
  }

  /**
   * PID column, right-aligned to 6 characters and dimmed.
   */
  private formatPid(pid: number) {
    return this.colorize("pid", String(pid).padStart(PID_WIDTH, " "));
  }

  /**
   * Timestamp as "YYYY-MM-DD HH:mm:SS", dimmed.
   */
  private formatTimestamp(date: Date) {
    const pad = (n: number) => String(n).padStart(2, "0");

    const raw =
      `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}` +
      ` ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;

    return this.colorize("timestamp", raw);
  }

  /**
   * Level as uppercase, width = 5, right-aligned and colored.
   */
  private formatLevel(level: LogLevel) {
    const label = LEVEL_LABEL[level] ?? "LOG";
    const padded = label.padStart(LEVEL_WIDTH, " ");
    return this.colorize("level", padded, level);
  }

  private stringify(level: LogLevel, args: unknown[]) {
    return args.map(v => this.stringifySingle(level, v)).join(" ");
  }

  private stringifySingle(level: LogLevel, value: unknown) {
    if (value == null) return String(value);
    if (value instanceof Error) return this.colorize("level", format(value), level);

    const t = typeof value;
    if (t === "string") return value as string;
    if (t === "number" || t === "boolean" || t === "bigint" || t === "symbol")
      return String(value as number | boolean | bigint | symbol);

    if (t === "function") {
      const fn = value as () => unknown;
      return `[Function${fn.name ? ` ${fn.name}` : ""}]`;
    }

    return inspect(value, { colors: true, depth: 6, breakLength: 100 });
  }

  private getStreamForLevel(level: LogLevel) {
    return level >= LogLevel.ERROR ? process.stderr : process.stdout;
  }

  /**
   * Centralized coloring rules (single place to tweak styling).
   */
  private colorize(kind: "prefix" | "pid" | "timestamp" | "level", value: string, level?: LogLevel) {
    switch (kind) {
      case "prefix":
        return pc.cyan(pc.bold(value));
      case "pid":
      case "timestamp":
        return pc.dim(value);
      case "level": {
        const color = (level && LEVEL_COLOR[level]) ?? pc.whiteBright;
        return color(value);
      }

      default:
        return value;
    }
  }
}

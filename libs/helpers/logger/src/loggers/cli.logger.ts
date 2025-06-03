import pc from "picocolors";

import { CliLogger as InternalCliLogger, LoggerOptions } from "@velnora/logger-engine-cli";

export class CliLogger {
  private readonly instance: InternalCliLogger;

  constructor(options: LoggerOptions) {
    this.instance = new InternalCliLogger(options);
  }

  debug(...messages: any[]) {
    this.instance.debug(this.handleMessages(messages));
    return this;
  }

  info(...messages: any[]) {
    this.instance.info(this.handleMessages(messages));
    return this;
  }

  warn(...messages: any[]) {
    this.instance.warn(this.handleMessages(messages));
    return this;
  }

  error(...messages: any[]) {
    this.instance.error(this.handleMessages(messages));
    return this;
  }

  fatal(...messages: any[]) {
    this.instance.fatal(this.handleMessages(messages));
    return this;
  }

  private handleMessages(messages: any[]): string[] {
    return messages.map(message => {
      switch (typeof message) {
        case "string":
          return pc.white(message);

        case "number":
        case "bigint":
          return pc.cyan(message.toString());

        case "boolean":
          return pc.yellow(message.toString());

        case "undefined":
          return pc.gray("undefined");

        case "symbol":
          return pc.magenta(message.toString());

        case "function": {
          const fnName = message.name || "anonymous";
          return pc.green(`function ${fnName}() { ... }`);
        }

        case "object":
          if (message === null) {
            return pc.gray("null");
          }
          try {
            return pc.blue(JSON.stringify(message, null, 2));
          } catch {
            return pc.red("[Unserializable Object]");
          }

        default:
          return pc.red("[Unknown Type]");
      }
    });
  }
}

export const createLogger = (options: LoggerOptions) => new CliLogger(options);

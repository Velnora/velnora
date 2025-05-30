import { CliLogger as InternalCliLogger, LoggerOptions } from "@velnora/logger-engine-cli";

export class CliLogger {
  private readonly instance: InternalCliLogger;

  constructor(options: LoggerOptions) {
    this.instance = new InternalCliLogger(options);
  }

  debug(...messages: string[]) {
    this.instance.debug(messages);
    return this;
  }

  info(...messages: string[]) {
    this.instance.info(messages);
    return this;
  }

  warn(...messages: string[]) {
    this.instance.warn(messages);
    return this;
  }

  error(...messages: string[]) {
    this.instance.error(messages);
    return this;
  }

  fatal(...messages: string[]) {
    this.instance.fatal(messages);
    return this;
  }
}

export const createLogger = (options: LoggerOptions) => new CliLogger(options);

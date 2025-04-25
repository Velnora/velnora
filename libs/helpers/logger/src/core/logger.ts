import { type ConsolaInstance, type LogObject } from "consola";
import { Consola, type LogLevel, LogLevels, type LogType } from "consola";

import { envLogLevel } from "../const";
import { baseReporter } from "../reporters/base.reporter";
import { remoteReporter } from "../reporters/remote.reporter";
import type { CreateLoggerOptions, CreateRemoteReporterOptions } from "../types";

export class Logger {
  private readonly _consola: Consola;
  private readonly _logger: ConsolaInstance;

  constructor(private readonly options: CreateLoggerOptions) {
    this._consola = new Consola({ level: envLogLevel, reporters: [baseReporter(options)] });
    this._logger = this._consola.withTag(options.name);
  }

  debug(...messages: any[]) {
    this._logger.debug(this.logObject("debug", LogLevels.debug, messages));
  }

  info(...messages: any[]) {
    this._logger.info(this.logObject("info", LogLevels.info, messages));
  }

  success(...messages: any[]) {
    this._logger.success(this.logObject("success", LogLevels.success, messages));
  }

  fail(...messages: any[]) {
    this._logger.fatal(this.logObject("fail", LogLevels.fatal, messages));
  }

  warn(...messages: any[]) {
    this._logger.warn(this.logObject("warn", LogLevels.warn, messages));
  }

  error(...messages: any[]) {
    this._logger.error(this.logObject("error", LogLevels.error, messages));
  }

  withRemoteLogging(options: CreateRemoteReporterOptions) {
    this._consola.addReporter(remoteReporter(options, this.options));
  }

  private logObject(type: LogType, logLevel: LogLevel, messages: any[]): LogObject {
    return { tag: this.options.name, type, date: new Date(), level: logLevel, args: messages };
  }
}

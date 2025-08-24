import { Consola, type ConsolaInstance, LogLevels } from "consola";

import { envLogLevel } from "../const";
import { baseReporter } from "../reporters/base.reporter";
import { remoteReporter } from "../reporters/remote.reporter";
import type { CreateLoggerOptions, CreateRemoteReporterOptions } from "../types";
import type { InternalLogObject } from "../types/internal-log-object";
import type { LogObjectOptions } from "../types/log-object-options";
import type { EmojiTag } from "../utils/emoji";

export class Logger {
  private readonly _consola: Consola;
  private readonly _logger: ConsolaInstance;

  constructor(private readonly options: CreateLoggerOptions) {
    this._consola = new Consola({ level: envLogLevel, reporters: [baseReporter(options)] });
    this._logger = this._consola.withTag(options.name);
  }

  debug(emojiOrContext: EmojiTag, ...messages: any[]) {
    this._logger.debug(this.logObject({ type: "debug", level: LogLevels.debug, messages, emoji: emojiOrContext }));
  }

  info(emojiOrContext: EmojiTag, ...messages: any[]) {
    this._logger.info(this.logObject({ type: "info", level: LogLevels.info, messages, emoji: emojiOrContext }));
  }

  success(emojiOrContext: EmojiTag, ...messages: any[]) {
    this._logger.success(
      this.logObject({ type: "success", level: LogLevels.success, messages, emoji: emojiOrContext })
    );
  }

  fail(emojiOrContext: EmojiTag, ...messages: any[]) {
    this._logger.fatal(this.logObject({ type: "fail", level: LogLevels.fatal, messages, emoji: emojiOrContext }));
  }

  warn(emojiOrContext: EmojiTag, ...messages: any[]) {
    this._logger.warn(this.logObject({ type: "warn", level: LogLevels.warn, messages, emoji: emojiOrContext }));
  }

  error(emojiOrContext: EmojiTag, ...messages: any[]) {
    this._logger.error(this.logObject({ type: "error", level: LogLevels.error, messages, emoji: emojiOrContext }));
  }

  withRemoteLogging(options: CreateRemoteReporterOptions) {
    this._consola.addReporter(remoteReporter(options, this.options));
  }

  private logObject(options: LogObjectOptions): InternalLogObject {
    return {
      tag: this.options.name,
      type: options.type,
      date: new Date(),
      level: options.level,
      args: options.messages,
      emoji: options.emoji
    };
  }
}

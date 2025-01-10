import { type LogLevel, LoggerService as LoggerServiceType } from "@nestjs/common";

import { logger } from "../utils/logger";

export class LoggerService implements LoggerServiceType {
  constructor(private readonly appName: string) {}

  verbose(message: string, ctx: string) {
    logger.debug(this.fixMessage(message, ctx));
  }

  debug(message: string, ctx: string) {
    logger.debug(this.fixMessage(message, ctx));
  }

  log(message: string, ctx: string) {
    logger.info(this.fixMessage(message, ctx));
  }

  warn(message: string, ctx: string) {
    logger.warn(this.fixMessage(message, ctx));
  }

  error(message: string, ctx: string) {
    logger.error(this.fixMessage(message, ctx));
  }

  fatal(message: string, ctx: string) {
    logger.error(this.fixMessage(message, ctx));
  }

  setLogLevels(_levels: LogLevel[]) {}

  private fixMessage(message: string, ctx: string): string {
    return `[${this.appName}/${ctx}] ${message}`;
  }
}

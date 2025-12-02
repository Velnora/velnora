import type { LoggerService } from "@nestjs/common";
import type { Logger as VelnoraLogger } from "@velnora/schemas";

export const createLogger = (logger: VelnoraLogger) => {
  class CustomLogger implements LoggerService {
    verbose(...rest: unknown[]) {
      if (rest.length) rest.forEach(m => logger.trace(m));
    }

    debug(...rest: unknown[]) {
      if (rest.length) rest.forEach(m => logger.debug(m));
    }

    log(...rest: unknown[]) {
      if (rest.length) rest.forEach(m => logger.log(m));
    }

    warn(...rest: unknown[]) {
      if (rest.length) rest.forEach(m => logger.warn(m));
    }

    error(...rest: unknown[]) {
      if (rest.length) rest.forEach(m => logger.error(m));
    }

    fatal(...rest: unknown[]) {
      if (rest.length) rest.forEach(m => logger.fatal(m));
    }
  }

  return new CustomLogger();
};

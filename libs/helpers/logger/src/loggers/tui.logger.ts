import { TuiLogger as RustTuiLogger } from "@velnora/logger-engine-tui";

import type { OmitParams } from "../types/omit-params";

export class TuiLogger {
  static async instance(): Promise<TuiLogger> {
    const instance = await RustTuiLogger.instance();
    return new TuiLogger(instance);
  }

  private constructor(private readonly instance: RustTuiLogger) {}

  addTab(tab: string) {
    this.instance.addTab(tab);
    return this;
  }

  addItem(tab: string, item: string, section?: string | undefined | null) {
    this.instance.addItem(tab, item, section);
    return this;
  }

  container<const TParams extends readonly string[]>(
    ...containerParams: TParams
  ): Omit<TuiLogger, "debug" | "info" | "warn" | "error" | "fatal"> &
    OmitParams<Pick<TuiLogger, "debug" | "info" | "warn" | "error" | "fatal">, TParams> {
    const self = this;
    return {
      ...this,
      debug(...params: any[]) {
        return self.debug(...containerParams, ...params);
      },
      info(...params: any[]) {
        return self.info(...containerParams, ...params);
      },
      warn(...params: any[]) {
        return self.warn(...containerParams, ...params);
      },
      error(...params: any[]) {
        return self.error(...containerParams, ...params);
      },
      fatal(...params: any[]) {
        return self.fatal(...containerParams, ...params);
      }
    };
  }

  debug(item: string, section: string | undefined | null, ...messages: string[]) {
    this.instance.debug(item, section, messages);
    return this;
  }

  info(item: string, section: string | undefined | null, ...messages: string[]) {
    this.instance.info(item, section, messages);
    return this;
  }

  warn(item: string, section: string | undefined | null, ...messages: string[]) {
    this.instance.warn(item, section, messages);
    return this;
  }

  error(item: string, section: string | undefined | null, ...messages: string[]) {
    this.instance.error(item, section, messages);
    return this;
  }

  fatal(item: string, section: string | undefined | null, ...messages: string[]) {
    this.instance.fatal(item, section, messages);
    return this;
  }
}

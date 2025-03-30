import { appCtx } from "../core/page-context";

declare global {
  var __EXCEPTION_MANAGER__: ExceptionManager;
}

interface ExceptionStackTrace {
  file: string;
  line: number;
  column: number;
}

interface ExtraExceptionData {
  frame?: string;
  plugin?: string;
  id?: string;
}

class ExceptionManager {
  static instance() {
    if (!globalThis.__EXCEPTION_MANAGER__) {
      globalThis.__EXCEPTION_MANAGER__ = new ExceptionManager();
    }
    return globalThis.__EXCEPTION_MANAGER__;
  }

  handleError(error: unknown, ignoredCodes: string[] = []) {
    if (!(error instanceof Error)) return;
    if (!("code" in error)) return this.exception(error);
    // @ts-expect-error
    if (ignoredCodes.includes(error.code)) return;
    return this.exception(error);
  }

  exception(error: Error, extraData?: ExtraExceptionData): void;
  exception(message: string, stacktrace: ExceptionStackTrace[], extraData?: ExtraExceptionData): void;
  exception(
    errorOrMessage: Error | string,
    stacktraceOrExtraData?: ExceptionStackTrace[] | ExtraExceptionData,
    data: ExtraExceptionData = {}
  ) {
    const message = errorOrMessage instanceof Error ? errorOrMessage.message : errorOrMessage;
    const stacktrace =
      errorOrMessage instanceof Error
        ? this.getStacktrace(errorOrMessage)
        : (stacktraceOrExtraData as ExceptionStackTrace[]) || [];
    const extraData = errorOrMessage instanceof Error ? (stacktraceOrExtraData as ExtraExceptionData) : data;
    const errorAt = stacktrace?.[0];

    appCtx.vite.server.ws.send({
      type: "error",
      err: {
        loc: errorAt,
        message,
        stack: stacktrace.map(line => `  at ${line.file}:${line.line}:${line.column}`).join("\n"),
        ...extraData
      }
    });
  }

  private getStacktrace(error: Error): ExceptionStackTrace[] {
    const stacktrace = error.stack?.split("\n").slice(1);
    return (
      stacktrace?.map(line => {
        const [file, lineNumber, column] = line.split(":");
        return { file, line: parseInt(lineNumber), column: parseInt(column) };
      }) || []
    );
  }
}

export const exceptionManager = ExceptionManager.instance();

export const ErrorCodes = {
  ERR_MODULE_NOT_FOUND: "ERR_MODULE_NOT_FOUND"
};

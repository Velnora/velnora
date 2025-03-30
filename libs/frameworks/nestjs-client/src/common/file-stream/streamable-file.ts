import type { Readable } from "node:stream";

import type { StreamableFileOptions, StreamableHandlerResponse } from "@nestjs/common/file-stream/interfaces";

import { MethodNotAllowedInBrowserEnvironmentException } from "../exceptions/method-not-allowed-in-browser-environment.exception";

export class StreamableFile {
  constructor(buffer: Uint8Array, options?: StreamableFileOptions);
  constructor(readable: Readable, options?: StreamableFileOptions);
  constructor(
    _bufferOrReadStream: Uint8Array | Readable,
    readonly options: StreamableFileOptions = {}
  ) {
    throw new MethodNotAllowedInBrowserEnvironmentException();
  }

  getStream(): Readable {
    throw new MethodNotAllowedInBrowserEnvironmentException();
  }

  getHeaders(): { type: string; disposition: string; length: number } {
    throw new MethodNotAllowedInBrowserEnvironmentException();
  }

  get errorHandler(): (err: Error, response: StreamableHandlerResponse) => void {
    throw new MethodNotAllowedInBrowserEnvironmentException();
  }

  setErrorHandler(_handler: (err: Error, response: StreamableHandlerResponse) => void): this {
    throw new MethodNotAllowedInBrowserEnvironmentException();
  }

  get errorLogger(): (err: Error) => void {
    throw new MethodNotAllowedInBrowserEnvironmentException();
  }

  setErrorLogger(_handler: (err: Error) => void): this {
    throw new MethodNotAllowedInBrowserEnvironmentException();
  }
}

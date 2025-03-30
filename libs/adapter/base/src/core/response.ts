import { ServerResponse } from "http";

export abstract class Response extends ServerResponse {
  abstract get(key: string): this;

  abstract contentType(contentType: string): this;

  abstract status(code: number): this;

  abstract json<TData>(data: TData): void;

  abstract redirect(url: string): void;

  abstract send(data: string | Buffer): void;
}

import type { SsrBody } from "./ssr-body";

export interface SsrRenderResult {
  status?: number;
  headers?: Record<string, string>;
  body: SsrBody;
}

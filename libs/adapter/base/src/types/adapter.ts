import type { BootstrapFn } from "./bootstrap-fn";

export interface Adapter {
  boostrap: BootstrapFn;
}

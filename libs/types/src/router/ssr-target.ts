import type { SsrTargetMode } from "./ssr-target-mode";

export interface SsrTarget {
  environment: string;
  entry: string;
  mode?: SsrTargetMode;
  exportName?: string;
}

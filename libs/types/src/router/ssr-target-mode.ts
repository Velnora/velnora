import type { ValueOf } from "type-fest";

export const ssrTargetMode = {
  SINGLE_FILE: "singleFile",
  APP_DIR: "appDir"
} as const;

export type SsrTargetMode = ValueOf<typeof ssrTargetMode>;

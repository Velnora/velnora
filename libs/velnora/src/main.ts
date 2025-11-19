import type { PartialDeep } from "type-fest";

import type { VelnoraConfig } from "@velnora/schemas";

export type { BaseMountOptions } from "@velnora/plugin-api";

// export type { MountFn, UnmountFn, MountParams } from "@velnora/runtime-client";

export const defineConfig = (config?: PartialDeep<VelnoraConfig>) => (config || {}) as VelnoraConfig;

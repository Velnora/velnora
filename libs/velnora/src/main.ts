import type { PartialDeep } from "type-fest";

import type { VelnoraConfig } from "@velnora/types";

export type { BaseMountOptions } from "@velnora/plugin-api";

export const defineConfig = (config?: PartialDeep<VelnoraConfig>) => (config || {}) as VelnoraConfig;

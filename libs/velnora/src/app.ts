import type { PartialDeep } from "type-fest";

import type { VelnoraAppConfig } from "@velnora/schemas";

export const defineConfig = (config?: PartialDeep<VelnoraAppConfig>) => (config || {}) as VelnoraAppConfig;

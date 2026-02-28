import type { UserConfig } from "vite";

import { defineBaseConfig } from "./config/define-base-config";
import type { VelnoraLibConfig } from "./types/velnora-lib-config";

export const defineNodeConfig = (options: VelnoraLibConfig): UserConfig => {
  return defineBaseConfig(options, {
    build: { ssr: true }
  });
};

export const defineWebConfig = defineBaseConfig;

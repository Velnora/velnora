import type { UserConfig } from "@fluxora/types";

export const defineConfig = <T extends UserConfig>(config: T) => config;

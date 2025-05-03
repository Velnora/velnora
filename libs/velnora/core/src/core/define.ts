import type {
  PartialUserAppConfig,
  PartialUserConfig,
  PartialUserLibConfig,
  PartialUserTemplateConfig,
  UserAppConfig,
  UserConfig,
  UserLibConfig,
  UserTemplateConfig
} from "@velnora/types";

export const defineConfig = (config: PartialUserConfig) => config as UserConfig;
export const defineAppConfig = (config: PartialUserAppConfig) => config as UserAppConfig;
export const defineLibConfig = (config: PartialUserLibConfig) => config as UserLibConfig;
export const defineTemplateConfig = (config: PartialUserTemplateConfig) => config as UserTemplateConfig;

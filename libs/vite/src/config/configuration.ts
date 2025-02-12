import type { InlineConfig } from "vite";

import { AppType, type Package } from "@fluxora/types/core";

import { getAppConfiguration, getTemplateConfiguration } from "../config";

export const getConfiguration = async (pkg: Package): Promise<InlineConfig> =>
  pkg.type === AppType.APPLICATION
    ? getAppConfiguration(pkg)
    : pkg.type === AppType.LIBRARY
      ? {}
      : pkg.type === AppType.TEMPLATE
        ? getTemplateConfiguration(pkg)
        : {};

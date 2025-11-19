// in core:
import { resolve } from "node:path";

import type { Package, VelnoraAppConfig } from "@velnora/schemas";

import { loadConfigFile } from "../../utils";

export class AppConfigManager {
  private cache = new Map<Package, VelnoraAppConfig>();

  async getFor(pkg: Package) {
    if (this.cache.has(pkg)) return this.cache.get(pkg)!;

    const config = await loadConfigFile<VelnoraAppConfig>(resolve(pkg.root, "velnora.config"));
    this.cache.set(pkg, config);
    return config;
  }
}

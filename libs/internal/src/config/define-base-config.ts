import { defu } from "defu";
import { type BuildConfig, defineBuildConfig } from "unbuild";

import type { WithRequiredName } from "../types/with-required-name";
import { buildEntries } from "./build-entries";
import { getPkgName } from "./get-pkg-name";

/**
 * Internal base builder used by both Node + Web wrappers.
 * - Keeps the exact same public API for define{Node,Web}Config
 * - Injects shared defaults once
 * - Allows env-specific defaults (node/web) without “abstracting” user options
 */
export const defineBaseConfig = (options: WithRequiredName<BuildConfig>, envDefaults: BuildConfig) => {
  const pkgName = getPkgName(options.name);
  const entries = buildEntries(pkgName, options.entries);

  return defineBuildConfig(
    defu<BuildConfig, BuildConfig[]>({ ...options, name: pkgName, entries }, envDefaults, {
      outDir: "build",
      declaration: true,
      clean: true,
      failOnWarn: false
    })
  );
};

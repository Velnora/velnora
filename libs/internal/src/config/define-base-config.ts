import { defu } from "defu";
import { type UserConfig, defineConfig } from "vite";
import dtsPlugin from "vite-plugin-dts";

import type { VelnoraLibConfig } from "../types/velnora-lib-config";
import { buildEntries } from "./build-entries";
import { getPkgName } from "./get-pkg-name";

export const defineBaseConfig = (options: VelnoraLibConfig, envDefaults?: UserConfig): UserConfig => {
  const pkgName = getPkgName(options.name);
  const entry = options.build?.lib ? buildEntries(pkgName, options.build?.lib?.entry) : { [pkgName]: "src/main.ts" };

  return defineConfig(
    defu<UserConfig, UserConfig[]>(
      {
        plugins: [dtsPlugin({ rollupTypes: true })],
        build: {
          outDir: "build",
          emptyOutDir: true,
          lib: {
            entry,
            name: pkgName,
            formats: ["es"]
          }
        }
      },
      envDefaults || {}
    )
  );
};

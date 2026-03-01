import { defu } from "defu";
import { type UserConfig, defineConfig } from "vite";
import dtsPlugin from "vite-plugin-dts";
import tsconfigPaths from "vite-tsconfig-paths";

import type { VelnoraLibConfig } from "../types/velnora-lib-config";
import { buildEntries } from "./build-entries";
import { getPkgName } from "./get-pkg-name";

export const defineBaseConfig = ({ name, ...userConfig }: VelnoraLibConfig, envDefaults?: UserConfig): UserConfig => {
  const pkgName = getPkgName(name);
  const entry = userConfig.build?.lib
    ? buildEntries(pkgName, userConfig.build?.lib?.entry)
    : { [pkgName]: "src/main.ts" };

  delete userConfig.build?.lib;

  return defineConfig(
    defu<UserConfig, UserConfig[]>(
      userConfig,
      {
        plugins: [dtsPlugin({ rollupTypes: true, pathsToAliases: false }), tsconfigPaths()],
        build: {
          outDir: "build",
          emptyOutDir: true,
          lib: {
            entry,
            name: pkgName,
            formats: ["es"]
          },
          rollupOptions: {
            external: /^@velnora\/.*$/
          }
        }
      },
      envDefaults || {}
    )
  );
};

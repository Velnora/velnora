import { type InlineConfig, type PluginOption, mergeConfig } from "vite";

import { AppType, type Package } from "@fluxora/types/core";
import react from "@vitejs/plugin-react-swc";

import { dynamicFederationPlugin, fluxoraPlugin, internalLibDevelopmentPlugin } from "../plugins";
import { isModuleInstalled } from "../utils/is-module-installed";

declare global {
  var __IS_LIBRARY_DEVELOPMENT__: boolean;
}

export const getCommonConfiguration = async (
  app: Package,
  specificConfiguration: InlineConfig
): Promise<InlineConfig> => {
  const plugins: PluginOption[] = [
    react({ tsDecorators: true }),

    // ToDo: Check on ci builds
    __IS_LIBRARY_DEVELOPMENT__ && internalLibDevelopmentPlugin(),

    app.type === AppType.APPLICATION && fluxoraPlugin(app),
    app.type === AppType.APPLICATION && dynamicFederationPlugin(app)
  ];

  if (isModuleInstalled("vite-plugin-inspect")) {
    const { default: inspect } = await import("vite-plugin-inspect");
    plugins.push(inspect());
  }

  return mergeConfig<InlineConfig, InlineConfig>(
    {
      root: process.cwd(),
      mode: process.env.NODE_ENV || "production",
      plugins,
      build: {
        minify: "terser",
        terserOptions: { compress: { passes: 2, drop_console: true }, format: { comments: false } },
        emptyOutDir: false,
        sourcemap: true,
        ssrManifest: "ssr-manifest.json",
        modulePreload: false,
        write: true,
        rollupOptions: {
          external: [/^@fluxora\/(?!server|client)\/?.*/],
          onwarn(warning, warn) {
            if (warning.message.includes("Module level directives cause errors when bundled")) return;
            warn(warning);
          }
        }
      },
      logLevel: "silent",
      appType: "custom"
    },
    specificConfiguration || {}
  );
};

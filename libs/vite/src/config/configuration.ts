import { resolve } from "node:path";

import { type InlineConfig, type PluginOption, mergeConfig } from "vite";

import type { FluxoraApp } from "@fluxora/types/core";
import react from "@vitejs/plugin-react-swc";

import { dynamicFederationPlugin } from "../plugins/dynamic-federation/dynamic-federation.plugin";
import { fluxoraPlugin } from "../plugins/fluxora/fluxora.plugin";
import { isModuleInstalled } from "../utils/is-module-installed";

export const getConfiguration = async (specificConfiguration: InlineConfig): Promise<InlineConfig> => {
  const plugins: PluginOption[] = [
    react({ tsDecorators: true })
    // fluxoraPlugin(config),
    // await dynamicFederationPlugin(config)
  ];

  if (isModuleInstalled("vite-plugin-inspect")) {
    const { default: inspect } = await import("vite-plugin-inspect");
    plugins.push(inspect());
  }

  return mergeConfig<InlineConfig, InlineConfig>(
    {
      root: process.cwd(),
      mode: process.env.NODE_ENV || "production",
      build: {
        minify: "terser",
        terserOptions: { compress: { passes: 2, drop_console: true }, format: { comments: false } },
        emptyOutDir: true,
        sourcemap: true,
        ssrManifest: "ssr-manifest.json",
        modulePreload: false,
        rollupOptions: {
          external: [/^@fluxora\/(?!server|client)\/?.*/],
          onwarn(warning, warn) {
            if (warning.message.includes("Module level directives cause errors when bundled")) return;
            warn(warning);
          }
        }
      },
      logLevel: "silent",
      appType: "custom",
      worker: {
        plugins() {
          return plugins;
        },
        format: "es"
      }
    },
    specificConfiguration || {}
  );
};

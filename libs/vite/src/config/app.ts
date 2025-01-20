import { resolve } from "node:path";

import type { InlineConfig, PluginOption } from "vite";

import type { FluxoraApp } from "@fluxora/types/core";
import { PACKAGE_ENTRIES, VITE_ENVIRONMENTS } from "@fluxora/utils";
import react from "@vitejs/plugin-react-swc";

// import { dynamicFederationPlugin } from "../plugins/dynamic-federation/dynamic-federation.plugin";
import { fluxoraPlugin } from "../plugins/fluxora/fluxora.plugin";
import { isModuleInstalled } from "../utils/is-module-installed";
import { logger } from "../utils/logger";

export const getAppConfiguration = async (config: FluxoraApp): Promise<InlineConfig> => {
  const port = +new URL(config.app.host.host, "http://localhost").port;
  const plugins: PluginOption[] = [
    react({ tsDecorators: true }),
    fluxoraPlugin(config)
    // await dynamicFederationPlugin(config)
  ];

  if (isModuleInstalled("vite-plugin-inspect")) {
    const { default: inspect } = await import("vite-plugin-inspect");
    plugins.push(inspect());
  }

  const viteConfig: InlineConfig = {
    root: config.app.root,
    mode: process.env.NODE_ENV,
    configFile: config.vite.configFile,
    server: { port, host: true, ws: false, watch: {} },
    build: {
      emptyOutDir: true,
      sourcemap: true,
      ssrManifest: "ssr-manifest.json",
      rollupOptions: {
        external: [/^@fluxora\/(?!server|client)\/?.*/],
        onwarn(warning, warn) {
          if (warning.message.includes("Module level directives cause errors when bundled")) return;
          warn(warning);
        }
      }
    },
    cacheDir: resolve(config.cacheRoot, "apps", config.app.name, ".vite"),
    plugins,
    logLevel: "silent",
    appType: "custom",
    environments: {
      [VITE_ENVIRONMENTS.SERVER]: {
        build: {
          ssr: true,
          lib: { entry: { server: PACKAGE_ENTRIES.FLUXORA_SERVER_ENTRY }, formats: ["es"] },
          outDir: resolve(config.outDirRoot, config.app.name, "server")
        },
        consumer: "server"
      },
      [VITE_ENVIRONMENTS.CLIENT]: {
        build: {
          minify: true,
          manifest: "manifest.json",
          lib: { entry: { client: PACKAGE_ENTRIES.FLUXORA_CLIENT_ENTRY_CLIENT_REACT }, formats: ["es"] },
          outDir: resolve(config.outDirRoot, config.app.name, "client")
        }
      },
      [VITE_ENVIRONMENTS.SSR]: {
        build: {
          ssr: true,
          lib: { entry: { ssr: PACKAGE_ENTRIES.FLUXORA_CLIENT_ENTRY_CLIENT_REACT }, formats: ["es"] },
          outDir: resolve(config.outDirRoot, config.app.name, "ssr")
        }
      }
    },
    builder: {
      async buildApp(builder) {
        logger.info(`Building (${config.app.name})`);
        const startTime = performance.now();

        await builder.build(builder.environments[VITE_ENVIRONMENTS.SERVER]);
        await builder.build(builder.environments[VITE_ENVIRONMENTS.CLIENT]);
        await builder.build(builder.environments[VITE_ENVIRONMENTS.SSR]);

        const diff = (performance.now() - startTime).toFixed(2);
        logger.info(`Application ${config.app.name} built in ${diff}ms`);
      }
    }
  };

  if (viteConfig.mode === "development" && config.app.host.devWsPort) {
    viteConfig.server!.ws = undefined;
    viteConfig.server!.hmr = { host: "localhost", path: "hmr", protocol: "ws", port: config.app.host.devWsPort };
  }

  return viteConfig;
};

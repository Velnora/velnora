import { type Plugin, defineConfig } from "vite";

import { appManager, initialLoadExposedModules } from "@fluxora/common";
import type { App } from "@fluxora/types/core";
import type { RemoteApp } from "@fluxora/types/federation";
import { FEDERATION_MICRO_APP_IMPORT_RE, VIRTUAL_ALIAS_ENTRIES } from "@fluxora/utils";

export const remotesPlugin = async (app: App): Promise<Plugin> => {
  const importersMap = new Map<string, Set<string>>();

  return {
    name: "fluxora:core-plugins:federation:remotes",

    config() {
      const remotes = appManager
        .getApps()
        .filter(a => a.name !== app.name)
        .map<RemoteApp>(app => ({
          name: app.name,
          url: new URL(app.remoteEntry.entryPath, app.host).href,
          modules: app.config.exposedModules,
          format: "esm",
          from: "vite"
        }));

      return defineConfig({
        define: {
          __remotes: JSON.stringify(remotes)
        }
      });
    },

    resolveId(id, importer) {
      if (id === app.remoteEntry.entryPath) {
        return id;
      }

      if (id === VIRTUAL_ALIAS_ENTRIES.FEDERATION_EXTERNALS) {
        return id;
      }

      if (id.match(FEDERATION_MICRO_APP_IMPORT_RE)) {
        if (importer) {
          const importers = importersMap.get(id) || new Set();
          importers.add(importer);
          importersMap.set(id, importers);
        }
        return id;
      }
    },

    async load(id) {
      if (id === app.remoteEntry.entryPath) {
        await initialLoadExposedModules(app, app.config.exposedModules);
        return (
          Object.entries(app.config.exposedModules)
            .map(([file, modules]) => `export { ${modules.join(", ")} } from "${file}";`)
            .join("\n") || "export {};"
        );
      }

      if (id.match(FEDERATION_MICRO_APP_IMPORT_RE)) {
        return `export {};`;
      }

      if (id === VIRTUAL_ALIAS_ENTRIES.FEDERATION_EXTERNALS) {
        return `export const wrapShareScope = (remoteFrom) => ({});`;
      }
    },

    async transform(code, id) {
      if (id.match(FEDERATION_MICRO_APP_IMPORT_RE)) {
        // const contentPromises = Array.from(importersMap.get(id) || new Set<string>()).map(importer =>
        //   readFile(importer, "utf-8")
        // );
        // const contents = await Array.fromAsync(contentPromises);
        // console.log(contents);
        //
        // console.log(code);

        const [appName, exposedModule] = id.split("/");

        return `
import { __federation_get_remote } from "@fluxora/client/federation";

const Component = await __federation_get_remote("${appName}", "${exposedModule}");
// console.log(Component);

export * from "/Users/mdrealiyev/Projects/fluxora/examples/base/apps/order/src/components/header.tsx";`;
      }
    }

    // transformIndexHtml() {
    //   const remotes = appManager
    //     .getApps()
    //     .filter(a => a.name !== app.name)
    //     .map<RemoteApp>(app => ({
    //       name: app.name,
    //       url: new URL(app.remoteEntry.entryPath, app.host).href,
    //       modules: app.config.exposedModules,
    //       format: "esm",
    //       from: "vite"
    //     }));
    //
    //   return [
    //     {
    //       tag: "script",
    //       attrs: { id: "__remotes__", type: "application/json" },
    //       children: JSON.stringify(remotes),
    //       injectTo: "head-prepend"
    //     }
    //   ];
    // }
  };
};

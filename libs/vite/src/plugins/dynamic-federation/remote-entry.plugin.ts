import { parse } from "node-html-parser";
import { type Plugin, defineConfig } from "vite";

import type { FluxoraApp } from "@fluxora/types/core";

export const remoteEntryPlugin = async (config: FluxoraApp): Promise<Plugin> => {
  const externalImportListPromises = config.apps
    .filter(configApp => configApp.name !== config.app.name)
    .map(async app => [app.name, app.host] as const);

  const externalImportList = (await Promise.all(externalImportListPromises)).filter(([, conf]) => !!conf);
  const externalImports = Object.fromEntries(externalImportList);

  const importMap = {
    imports: externalImportList.reduce(
      (acc, [appName, appConfigHosts]) => {
        //     acc[appName] = new URL(appConfig.remoteEntry.entryPath, appConfigHosts.clientHost).toString();
        //
        //     Array.from(appConfig.exposedModules.entries()).forEach(([, moduleName]) => {
        //       acc[`${appName}/${moduleName}`] = new URL(
        //         appConfig.remoteEntry.entryPath.replace(".js", `/${moduleName}.js`),
        //         appConfig.client.host
        //       ).toString();
        //     });

        return acc;
      },
      {} as Record<string, string>
    )
  };

  const importMapScript = `<script type="importmap">${JSON.stringify(importMap)}</script>`;

  return {
    name: "fluxora:core-plugins:dynamic-federation:remote-entry",
    enforce: "pre",

    config() {
      return defineConfig({
        build: {
          rollupOptions: {
            external(id) {
              return id.startsWith("http");
            }
          }
        }
      });
    },

    resolveId(id) {
      if (externalImports[id]) {
        return id;
      }
    },

    load(id) {
      if (externalImports[id]) {
        const [appName, module] = id.split("/");
        if (module) {
          return `export { ${module} } from "${importMap.imports[appName]}"`;
        } else {
          return `export * from "${importMap.imports[appName]}"`;
        }
      }
    },

    transformIndexHtml: {
      order: "post",
      handler(html) {
        const root = parse(html);
        const firstScript = root.querySelector("script");
        const body = root.querySelector("body");
        const container = firstScript ? firstScript : body ? body : root;
        const isBeforeBegin = !!firstScript;
        container.insertAdjacentHTML(isBeforeBegin ? "beforebegin" : "beforeend", importMapScript);
        return root.toString();
      }
    }
  };
};

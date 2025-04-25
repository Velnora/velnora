import { type Plugin } from "vite";

import { frameworkRegistry } from "@fluxora/framework-loader";
import { RegisteredApp, appCtx } from "@fluxora/runtime";
import { CHECK_VIRTUAL_ENTRIES, VIRTUAL_ENTRIES, capitalize } from "@fluxora/utils";
import { CLIENT_ENTRY_FILE_EXTENSIONS, findFile } from "@fluxora/utils/node";

export const fluxoraAppPlugin = (app: RegisteredApp): Plugin => {
  return {
    name: "fluxora:app-client",
    enforce: "pre",

    async resolveId(id) {
      if (
        CHECK_VIRTUAL_ENTRIES.APP_CLIENT_ENTRY(id) ||
        CHECK_VIRTUAL_ENTRIES.APP_TEMPLATE(id) ||
        CHECK_VIRTUAL_ENTRIES.APP_CLIENT_ROUTES(id) ||
        CHECK_VIRTUAL_ENTRIES.APP_CLIENT_SCRIPT(id) ||
        CHECK_VIRTUAL_ENTRIES.APP_CLIENT_JSON(id)
      ) {
        return id;
      }
    },

    async load(id) {
      if (CHECK_VIRTUAL_ENTRIES.APP_CLIENT_ENTRY(id)) {
        const clientPackageName = frameworkRegistry.getClientRenderer(app.config.framework);
        const resolvedClientPackage = await this.resolve(clientPackageName);
        const resolvedClientPackageId = resolvedClientPackage?.id || id;

        const resolvedRouterPackage = await this.resolve("@fluxora/router");
        const resolvedRouterPackageId = resolvedRouterPackage?.id || id;

        return `
import "reflect-metadata";
import { mount, hydrate } from "${resolvedClientPackageId}";
import Template from "${VIRTUAL_ENTRIES.APP_TEMPLATE(app.name)}";
import { resolveRoutes } from "${resolvedRouterPackageId}";
import appJson from "${VIRTUAL_ENTRIES.APP_CLIENT_JSON(app.name)}" with { type: "json" };

const router = await resolveRoutes(appJson);
const pathname = window.location.pathname;
const route = router.getWithFallback(pathname, "/");

if ("${app.config.ssr}" === "true") {
  hydrate(route, Template);
} else {
  await mount(route);
}
`.trimStart();
      }

      if (CHECK_VIRTUAL_ENTRIES.APP_TEMPLATE(id)) {
        const appTemplate = appCtx.projectStructure.template.getModule(app.config.template);
        const templateEntry = appTemplate.getEntryPoint();
        if (!templateEntry) {
          // ToDo: Handle Error
          this.error(`Template entry point not found for "${appTemplate.name}" template`);
          return;
        }
        const templateModuleName = capitalize(appTemplate.name);
        return `
import * as template__import from "${templateEntry}";
const Template = template__import["${templateModuleName}"] || template__import.App || template__import.default;
export default Template;
`.trimStart();
      }

      if (CHECK_VIRTUAL_ENTRIES.APP_CLIENT_ROUTES(id)) {
        const routesFile = findFile(app.root, "client/routes", CLIENT_ENTRY_FILE_EXTENSIONS);
        if (routesFile) {
          return `export * from "${routesFile}";`;
        }

        return `export default undefined;`;
      }

      if (CHECK_VIRTUAL_ENTRIES.APP_CLIENT_SCRIPT(id)) {
        const scriptFile = findFile(app.root, "client/entry-client", CLIENT_ENTRY_FILE_EXTENSIONS);
        if (scriptFile) {
          return `export * from "${scriptFile}";`;
        }

        return `
export default () => {
  throw new Error("No routes or entry-client files found for \"${app.name}\" app");
}
`;
      }

      if (CHECK_VIRTUAL_ENTRIES.APP_CLIENT_JSON(id)) {
        const object = app.raw();
        return JSON.stringify(object);
      }
    }
  };
};

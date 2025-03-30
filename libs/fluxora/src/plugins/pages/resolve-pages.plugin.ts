import { basename, extname } from "node:path";

import { type Plugin, isRunnableDevEnvironment } from "vite";

import {
  CLIENT_ENTRY_FILE_EXTENSIONS,
  SERVER_ENTRY_FILE_EXTENSIONS,
  VIRTUAL_ENTRIES,
  VITE_ENVIRONMENTS,
  appCtx,
  capitalize,
  findEntryFile
} from "@fluxora/utils";

import { traverse } from "../../utils/traverse";

export const resolvePagesPlugin = (): Plugin => {
  return {
    name: "fluxora:pages:render-page",
    enforce: "pre",

    async resolveId(id) {
      let m: RegExpMatchArray | null;

      if ((m = id.match(appCtx.projectStructure.apps.regex))) {
        const appName = m[1];
        const importPath = id.replace(new RegExp(`^${m[0]}`), ".");

        if (!appCtx.projectStructure.apps.isAppLoaded(appName)) await appCtx.projectStructure.apps.loadApp(appName);
        const modules = appCtx.projectStructure.apps.getAppExposedModules(appName);

        if (modules?.has(importPath)) {
          return modules.get(importPath);
        }
      }

      if (VIRTUAL_ENTRIES.APP.is(id) || VIRTUAL_ENTRIES.PAGE_JS.is(id) || VIRTUAL_ENTRIES.APP_SERVER.is(id)) {
        return id;
      }
    },

    async load(id) {
      let m: RegExpMatchArray | null;

      if ((m = VIRTUAL_ENTRIES.APP.is(id))) {
        const [, page] = m;
        const app = appCtx.projectStructure.apps.getAppByPath(page);
        if (!app) {
          throw new Error("App not found");
        }

        const entryJsFile = findEntryFile(
          appCtx.projectStructure.apps.getAppPath(app)!,
          "entry-client",
          CLIENT_ENTRY_FILE_EXTENSIONS
        );
        return `
import * as app__import from "${entryJsFile}";

const __appImportName = ["${capitalize(app)}", "App", "default"].find(__import => __import in app__import);
const App = __appImportName ? app__import[__appImportName] : ({ children }) => children;
export default App;
`;
      }

      if ((m = VIRTUAL_ENTRIES.PAGE_JS.is(id))) {
        const [, page] = m;
        const app = appCtx.projectStructure.apps.getAppByPath(page);
        if (!app) {
          throw new Error(`App "${app}" not found`);
        }

        return `
import Page from "${VIRTUAL_ENTRIES.APP(app)}";
import { hydrate } from "@fluxora/framework-${appCtx.projectStructure.apps.frameworkName}";

hydrate(Page);
        `.trimStart();
      }

      if ((m = VIRTUAL_ENTRIES.APP_SERVER.is(id))) {
        const [, page] = m;
        const app = appCtx.projectStructure.apps.getAppByPath(page);
        if (!app) {
          throw new Error(`App "${app}" not found`);
        }

        const entryJsFile = findEntryFile(
          appCtx.projectStructure.apps.getAppPath(app)!,
          "entry-server",
          SERVER_ENTRY_FILE_EXTENSIONS
        );

        return `
import * as server__import from "${entryJsFile}";

const __serverImportName = ["${capitalize(app)}Module", "AppModule", "default"].find(__import => __import in server__import);
const AppModule = __serverImportName ? server__import[__serverImportName] : class { constructor() { throw new Error("${capitalize(app)}Module not found"); } };
Object.defineProperty(AppModule, "name", { value: "${capitalize(app)}Module" });
export default AppModule;
`;
      }
    },

    transform(code, id) {
      traverse(code, {
        DirectiveLiteral(literal) {
          if (literal.node.value) {
            const directive = literal.node.value as string;
            if (directive === "use expose") {
              const foundAppById = appCtx.projectStructure.apps.getAppByPath(id);
              if (!foundAppById) {
                throw new Error(
                  `App not found by id: "${id}". Please check location of exposed module. It must be inside the app itself.`
                );
              }
              const importPath = basename(id, extname(id));
              appCtx.projectStructure.apps.addAppExposedModule(foundAppById, `./${importPath}`, id);
              appCtx.projectStructure.apps.addPathsToApp(foundAppById, importPath);
            }
          }
        }
      });
    },

    transformIndexHtml: {
      order: "pre",
      async handler(_, { server, path }) {
        if (server) {
          const serverEnv = server.environments[VITE_ENVIRONMENTS.SERVER];
          if (!isRunnableDevEnvironment(serverEnv)) throw new Error(`Server app's dev environment is not runnable`);
          const fluxoraReactServer = await serverEnv.runner.import<typeof import("@fluxora/framework-react/server")>(
            `@fluxora/framework-${appCtx.projectStructure.apps.frameworkName}/server`
          );

          const stream = await fluxoraReactServer.render(path);
          let html = "";
          for await (const chunk of stream) html += chunk.toString();
          return html;
        }
      }
    }
  };
};

import { PassThrough } from "node:stream";

import { renderToString } from "react-dom/server";
import { type ErrorPayload, type Plugin, isRunnableDevEnvironment } from "vite";

import { App as NoopApp } from "@fluxora/client/react/noop";
import { appManager } from "@fluxora/common";
import type { App } from "@fluxora/types/core";
import {
  CLIENT_ENTRY_FILE_EXTENSIONS,
  DEFAULT_HTML_TEMPLATE,
  ErrorMessages,
  PACKAGE_ENTRIES,
  PACKAGE_ORIGINALS,
  VITE_ENVIRONMENTS,
  capitalize
} from "@fluxora/utils";
import { projectFs } from "@fluxora/utils/node";

import { findEntryFile } from "../../utils/find-entry-file";

export const entryPlugin = (app: App): Plugin => {
  return {
    name: "fluxora:core-plugins:entry-app-html",
    enforce: "pre",

    resolveId(id) {
      if (id.endsWith("index.html")) {
        return id;
      }
    },

    async load(id) {
      if (id.endsWith("index.html")) {
        return DEFAULT_HTML_TEMPLATE;
      }
    },

    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        // ToDo: Handle app routes by router in future
        if (req.url === "/") {
          const html = await server.transformIndexHtml(req.url, "");
          if (!html) return next();
          return res.writeHead(200, { "Content-Type": "text/html" }).end(html);
        }

        next();
      });
    },

    configurePreviewServer(_server) {},

    transformIndexHtml: {
      order: "pre",
      async handler(_, { server }) {
        const template = appManager.getTemplateApp();
        let templateModule: any = null;
        let appModule: any = null;
        let entryServerModule: typeof import("@fluxora/client/react/entry-server") | null = null;

        if (server) {
          const serverEnv = server.environments[VITE_ENVIRONMENTS.SERVER];
          if (!isRunnableDevEnvironment(serverEnv)) throw new Error(ErrorMessages.SERVER_ENV_NOT_RUNNABLE);
          entryServerModule = (await serverEnv.runner.import(
            PACKAGE_ORIGINALS.REACT_CLIENT_SERVER_ENTRY
          )) as typeof import("@fluxora/client/react/entry-server");

          templateModule = await serverEnv.runner.import(
            findEntryFile(template.root, "main", CLIENT_ENTRY_FILE_EXTENSIONS)
          );

          appModule = await serverEnv.runner.import(
            findEntryFile(app.root, "entry-client", CLIENT_ENTRY_FILE_EXTENSIONS)
          );
        } else {
          entryServerModule = await import("@fluxora/client/react/entry-server");
          if (!template.buildOutput) {
            throw new Error(ErrorMessages.TEMPLATE_BUILD_OUTPUT_NOT_FOUND);
          }
          templateModule = await import(template.buildOutput);
          const appEntry = projectFs.cache.app(app.name).output;
          console.log(appEntry);
          appModule = await import(appEntry);
        }

        const onError = (error: unknown) => {
          htmlPromise.reject(error);
          if (server) {
            if (
              error instanceof Error &&
              typeof server.config.server?.hmr === "object" &&
              server.config.server?.hmr?.overlay !== false
            ) {
              server.ssrFixStacktrace(error);
              const errorPayload = { ...error } as ErrorPayload["err"];
              errorPayload.message ||=
                errorPayload.stack?.split("\n")[0] || ErrorMessages.WORKER_UNKNOWN_ERROR_ON_RENDER;
              server.ws.send({ type: "error", err: errorPayload });
            }
          }
        };

        const __templateImportName = ["Template", "App", "default"].find(e => e in templateModule);
        const TemplateApp = __templateImportName ? templateModule[__templateImportName] : NoopApp;

        const __appImportName = [capitalize(app.name), "App", "default"].find(e => e in appModule);
        const App = __appImportName
          ? appModule[__appImportName]
          : () => {
              throw new Error(`App ${capitalize(app.name)} not found`);
            };

        const jsx = (
          <TemplateApp>
            <App />
          </TemplateApp>
        );

        const htmlPromise = Promise.withResolvers<string>();
        const stream = entryServerModule.renderPipeableStream(jsx, {
          onShellReady() {
            const passThrough = new PassThrough();
            const chunks: string[] = [];

            stream.pipe(passThrough);

            passThrough.on("data", chunk => {
              chunks.push(chunk.toString());
            });

            passThrough.on("end", async () => {
              htmlPromise.resolve(chunks.join(""));
            });

            passThrough.on("error", err => {
              onError(err);
            });
          },
          onShellError() {},
          onError
        });

        try {
          const html = (await htmlPromise.promise) || DEFAULT_HTML_TEMPLATE;
          return {
            html,
            tags: [
              {
                tag: "script",
                attrs: { type: "module", src: PACKAGE_ENTRIES.REACT_CLIENT_ENTRY },
                injectTo: "head"
              }
            ]
          };
        } catch (e) {
          throw new Error(ErrorMessages.WORKER_UNKNOWN_ERROR_ON_RENDER, { cause: e });
        }
      }
    }
  };
};

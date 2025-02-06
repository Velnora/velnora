import { PassThrough } from "node:stream";

import { type ErrorPayload, type Plugin, isRunnableDevEnvironment } from "vite";

import type { FluxoraApp } from "@fluxora/types/core";
import { DEFAULT_HTML_TEMPLATE, ErrorMessages, PACKAGE_ENTRIES, VITE_ENVIRONMENTS } from "@fluxora/utils";

export const entryPlugin = (_config: FluxoraApp): Plugin => {
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
        const serverEnv = server.environments[VITE_ENVIRONMENTS.SERVER];

        if (!isRunnableDevEnvironment(serverEnv)) throw new Error(ErrorMessages.SERVER_ENV_NOT_RUNNABLE);

        const entryServerModule = (await serverEnv.runner.import(
          PACKAGE_ENTRIES.FLUXORA_SERVER
        )) as typeof import("@fluxora/server");

        const onError = (error: unknown) => {
          if (
            error instanceof Error &&
            typeof server.config.server?.hmr === "object" &&
            server.config.server?.hmr?.overlay !== false
          ) {
            server.ssrFixStacktrace(error);
            const errorPayload = { ...error } as ErrorPayload["err"];
            errorPayload.message ||= errorPayload.stack?.split("\n")[0] || ErrorMessages.WORKER_UNKNOWN_ERROR_ON_RENDER;
            server.ws.send({ type: "error", err: errorPayload });
          }

          server.transformIndexHtml(req.url!, DEFAULT_HTML_TEMPLATE).then(html => {
            res.writeHead(200, { "Content-Type": "text/html" }).end(html);
          });
        };

        // ToDo: Handle app routes by router in future
        if (req.url === "/") {
          const stream = entryServerModule.renderPipeableStream({
            onShellReady() {
              const passThrough = new PassThrough();
              const chunks: string[] = [];

              stream.pipe(passThrough);

              passThrough.on("data", chunk => {
                chunks.push(chunk.toString());
              });

              passThrough.on("end", async () => {
                const html = await server.transformIndexHtml(req.url!, chunks.join(""));
                res.writeHead(200, { "Content-Type": "text/html" }).end(html);
              });

              passThrough.on("error", err => {
                onError(err);
              });
            },
            onShellError() {},
            onError
          });
          return;
        }

        next();
      });
    },

    configurePreviewServer(_server) {},

    transformIndexHtml: {
      order: "pre",
      async handler() {
        // if (!server) return DEFAULT_HTML_TEMPLATE();
        return [
          {
            tag: "script",
            attrs: { type: "module", src: PACKAGE_ENTRIES.FLUXORA_CLIENT_ENTRY_CLIENT_REACT },
            injectTo: "head"
          }
        ];
      }
    }
  };
};

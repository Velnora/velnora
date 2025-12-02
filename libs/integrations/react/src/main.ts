import { defineIntegration } from "@velnora/plugin-api";
import viteReact from "@vitejs/plugin-react";

import pkg from "../package.json";
import { velnoraReactPlugin } from "./plugins/velnora-react.plugin";

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

declare global {
  namespace Velnora {
    interface AppConfigExtensions {
      react?: {
        mode?: "csr" | "ssr" | "rsc";
      };
    }
  }
}

export const react = defineIntegration(() => {
  return {
    name: "@velnora/integration-react",
    supportsHost: "vite",

    apply(ctx) {
      return (
        (ctx.fs.exists("client/app.{js,ts,jsx,tsx}") || ctx.fs.exists("client/app/page.{js,ts,jsx,tsx}")) &&
        ctx.pkg.ensurePackage("react", "18 || 19") &&
        ctx.pkg.ensurePackage("react-dom", "18 || 19")
      );
    },

    async configure(ctx) {
      ctx.fs.pushd("client");

      if (ctx.pkg.ensurePackage("@vitejs/plugin-react")) {
        ctx.logger.error(
          "For running React apps, @vitejs/plugin-react is required. Please install it and try again. Otherwise, React integration will be skipped."
        );
        ctx.fs.popd();
        return;
      }

      await ctx.vite.use(viteReact({ jsxRuntime: "automatic" }));
      await ctx.vite.use(velnoraReactPlugin());

      let clientEntryFile: string | null = null;
      const serverEntryFile: string | null = null;

      if (ctx.fs.exists("app.{js,ts,jsx,tsx}")) {
        const entryFiles = ctx.fs.glob("app.{js,ts,jsx,tsx}");
        if (entryFiles.length === 0) {
          ctx.logger.error("Could not find entry file for React app. Skipping React (client) integration.");
          ctx.fs.popd();
          return;
        }

        if (entryFiles.length > 1) {
          ctx.logger.warn("Multiple entry files found for React app. Using the first one found.");
        }

        const modulePath = ctx.fs.resolve(entryFiles[0]!);
        const appFile = ctx.vite.virtual(
          "client/app",
          `
import * as __module from "${modulePath}";
import { getModule } from "@velnora/devkit";

const App = getModule(__module, ["${capitalize(ctx.app.name)}", "App", "default"]);
if (!App) {
  throw new Error("A React module with names [\\"${capitalize(ctx.app.name)}\\", \\"App\\", \\"default\\"] wasn't exported from \\"${modulePath}\\"");
}
export default App;
`
        );

        clientEntryFile = ctx.vite.entryClient(`
import App from "${appFile}";
import { mount } from "${pkg.name}/client";

mount(App, "#root");
`);
      }

      if (clientEntryFile) {
        const clientEnvId = ctx.vite.addEnvironment("client", {});

        const indexFile = ctx.fs.resolve("index.html");

        ctx.router.registerFrontend({
          environment: clientEnvId,
          entry: clientEntryFile,
          indexHtmlFile: ctx.fs.exists(indexFile) ? indexFile : undefined
        });
      } else {
        ctx.logger.warn("Could not find entry file for React app. Skipping React (client) integration.");
      }

      if (serverEntryFile) {
        const serverEnvId = ctx.vite.addEnvironment("server", {});

        ctx.router.registerBackend({
          entry: serverEntryFile,
          environment: serverEnvId,
          runtime: "host"
        });
      } else {
        ctx.logger.warn("Could not find entry file for React app. Skipping React (server) integration.");
      }

      // if (ctx.fs.exists("apps")) {
      // } else {
      // ctx.router.addRoute("*", `virtual://${ctx.app.id}/entry/client`);
      // ctx.vite.virtual(`virtual://${ctx.app.id}/entry/client`, ctx.fs.file("app.tsx"));
      // }

      // ctx.pkg.addRuntime({ "react": "^18.3.1", "react-dom": "^18.3.1" });
      // ctx.pkg.addDev({ "@vitejs/plugin-react": "^4.3.0" });
      //
      // ctx.vite.define({ "~app": "/apps/web/src" });
      // ctx.registry.routes.add({ path: basePath, component: "~app/App" });
    },

    scaffold(ctx) {
      // if (!ctx.fs.exists("apps/web/src/main.tsx")) {
      //   ctx.fs.ensureDir("apps/web/src");
      //   ctx.fs.ensureFile("apps/web/src/App.tsx", `export default function App(){return <h1>Hello</h1>}`);
      //   ctx.fs.ensureFile(
      //     "apps/web/src/main.tsx",
      //     `
      //   import { createRoot } from "react-dom/client";
      //   import App from "./App";
      //   createRoot(document.getElementById("root")!).render(<App />);
      // `
      //   );
      //   ctx.fs.ensureFile(
      //     "apps/web/index.html",
      //     `
      //   <!doctype html><html><body><div id="root"></div><script type="module" src="/src/main.tsx"></script></body></html>
      // `
      //   );
      // }
    },

    build(ctx) {
      //   // 1) mount vite-react
      //   ctx.vite.use(() => import("@vitejs/plugin-react"), 100, { jsxRuntime: "automatic" });
      //
      //   // 2) expose a virtual module the app can import
      //   ctx.vite.virtual(
      //     "virtual:velnora/react-env",
      //     `
      //   export const MODE = ${JSON.stringify(mode ?? "csr")};
      //   export const RSC  = ${JSON.stringify(rsc ?? false)};
      // `
      //   );
      //
      //   // 3) if SSR requested, ask server side to pick our renderer by id
      //   if (mode === "ssr") {
      //     ctx.registry.server.httpHandler("react-ssr", "~server/react-ssr#render"); // id → file#export
      //   }
    },

    runtime(ctx) {
      // // Nothing to execute here in authoring-time; the host uses the registry to wire SSR.
      // ctx.log.info("React runtime registered.");
    }
  };
});

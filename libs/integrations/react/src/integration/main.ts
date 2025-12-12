import { defineIntegration } from "@velnora/plugin-api";
import viteReact from "@vitejs/plugin-react";

import { setupCsr } from "./core/setup-csr";
import { setupRsc } from "./core/setup-rsc";
import { setupSsr } from "./core/setup-ssr";

type ReactMode = "csr" | "ssr" | "rsc";

declare global {
  namespace Velnora {
    interface AppConfigExtensions {
      react?: {
        mode?: ReactMode;
      };
    }
  }
}

export const react = defineIntegration(() => {
  return {
    name: "@velnora/integration-react",

    vite: {
      plugins: [viteReact({ jsxRuntime: "automatic" })]
    },

    apply(ctx) {
      return (
        (ctx.fs.exists("client/app.{js,ts,jsx,tsx}") || ctx.fs.exists("client/app/**/page.{js,ts,jsx,tsx}")) &&
        ctx.pkg.ensurePackage("react", "18 || 19") &&
        ctx.pkg.ensurePackage("react-dom", "18 || 19")
      );
    },

    configure(ctx) {
      ctx.fs.pushd("client");

      const mode: ReactMode | null =
        ctx.app.config.integrations.react?.mode ||
        (ctx.fs.exists("app.{js,ts,jsx,tsx}") ? "csr" : ctx.fs.exists("app/**/page.{js,ts,jsx,tsx}") ? "ssr" : null);

      switch (mode) {
        case "csr":
          setupCsr(ctx);
          break;
        case "ssr":
          setupSsr(ctx);
          break;
        case "rsc":
          setupRsc(ctx);
          break;
        default:
          ctx.logger.error(
            `Could not determine React mode "${mode}" for app "${ctx.app.packageJson.name}" and no mode was specified in configuration. Skipping React integration.`
          );
      }
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

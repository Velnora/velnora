import { Plugin, defineConfig } from "vite";

import type { FluxoraApp } from "@fluxora/core";

export const webDns = (config: FluxoraApp): Plugin => {
  const appDomains = config.apps.reduce((acc, { name }) => ({ ...acc, [name]: `` }), {} as Record<string, string>);

  return {
    name: "fluxora:core-plugins:fluxora-entry",

    config() {
      return defineConfig({
        define: { __DNS_APP_JSON__: appDomains },
        server: { fs: { allow: [process.env.PROJECT_CWD!] } }
      });
    }
  };
};

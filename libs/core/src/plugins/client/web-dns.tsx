import { Plugin, defineConfig } from "vite";

import type { WebDnsOptions } from "./web-dns.types";

export const webDns = ({ allAppsConfigurations }: WebDnsOptions): Plugin => {
  const appDomains = Array.from(allAppsConfigurations.entries()).reduce(
    (acc, [app, config]) => ({ ...acc, [app]: config.domain }),
    {} as Record<string, string>
  );

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

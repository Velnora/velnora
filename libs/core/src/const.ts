export const SERVER_ENTRY_FILE_EXTENSIONS = ["ts", "js", "mjs", "cjs"];
export const CLIENT_ENTRY_FILE_EXTENSIONS = ["ts", "js", "mjs", "cjs", "jsx", "tsx"];
export const HTML_EXTENSIONS = ["html", "htm"];
export const CSS_EXTENSIONS = ["css", "scss", "sass", "less", "styl"];
export const JS_EXTENSIONS = ["js", "jsx", "mjs", "cjs", "ts", "tsx"];

export const isProd = process.env.NODE_ENV === "production";
export const isDev = !isProd;

export const FEDERATION_PLUGIN_NAME = "fluxora:app-plugins:dynamic-federation";

export const FEDERATION_PLUGIN_REMOTE_ENTRY_FILE_PATH_DEFAULT = "/assets/remoteEntry.js";

export const FEDERATION_INTERNALS = {
  REMOTE_ENTRY: "/@fluxora/plugins.module-federation/remote-entry.js",
  SINGLE_REMOTE_ENTRY: (module: string) => `/@fluxora/plugins.module-federation/single-remote-entry/${module}.js`
} as const;

export const PACKAGE_ENTRIES = {
  FLUXORA_CLIENT: "/@fluxora/client",
  FLUXORA_CLIENT_ENTRY_CLIENT_REACT: "/@fluxora/client/react",
  FLUXORA_CLIENT_ENTRY_SERVER_REACT: "/@fluxora/client-server/react",
  FLUXORA_SERVER: "/@fluxora/server",
  FLUXORA_SERVER_ENTRY: "/@fluxora/server/entry-server"
} as const;

export const PACKAGE_ORIGINALS = {
  FLUXORA_CLIENT: "@fluxora/client",
  FLUXORA_CLIENT_ENTRY_CLIENT_REACT: "@fluxora/client/react/entry-client",
  FLUXORA_CLIENT_ENTRY_SERVER_REACT: "@fluxora/client/react/entry-server",
  FLUXORA_SERVER: "@fluxora/server",
  FLUXORA_SERVER_DEV_ENTRY: "@fluxora/server/entry-dev",
  FLUXORA_SERVER_PROD_ENTRY: "@fluxora/server/entry-prod"
} as const;

export const VIRTUAL_ENTRIES = {
  APP: "/@fluxora/plugins.entry/virtual:entry/app.tsx",
  TEMPLATE: "/@fluxora/plugins.entry/virtual:entry/template.tsx"
} as const;
export const VIRTUAL_ENTRY_NAMES = new Set<string>(Object.values(VIRTUAL_ENTRIES));

export const VIRTUAL_ALIAS_ENTRIES = {
  APP: "/@fluxora/virtual/entry/react/app",
  TEMPLATE: "/@fluxora/virtual/entry/react/template",
  APP_MODULE: "/@fluxora/virtual/entry/app.module",
  APP_CONFIG: "/@fluxora/virtual/entry/app-config"
} as const;

export const NESTJS_PLUGIN_VIRTUAL_ENTRIES = {
  APP_MODULE: "/@fluxora/plugins.nestjs/virtual:entry/app.module.ts",
  APP_CONFIG: "/@fluxora/plugins.nestjs/virtual:entry/app.config.ts"
} as const;
export const NESTJS_PLUGIN_VIRTUAL_ENTRY_NAMES = new Set<string>(Object.values(NESTJS_PLUGIN_VIRTUAL_ENTRIES));

export const VITE_ENVIRONMENTS = {
  SERVER: "server",
  CLIENT: "client",
  SSR: "ssr"
} as const;

export const HTML_SCRIPT_TAG = `<script type="module" src="${PACKAGE_ENTRIES.FLUXORA_CLIENT_ENTRY_CLIENT_REACT}"></script>`;

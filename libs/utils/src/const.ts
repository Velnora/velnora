import type { ValueOf } from "type-fest";

export const SERVER_ENTRY_FILE_EXTENSIONS = ["ts", "js", "mjs", "cjs"];
export const CLIENT_ENTRY_FILE_EXTENSIONS = ["ts", "js", "mjs", "cjs", "jsx", "tsx"];

export const isProd = process.env.NODE_ENV === "production";
export const isDev = !isProd;

export const DEFAULT_REMOTE_ENTRY_PATH = "/assets/remoteEntry.js";

export const INTERNAL_PACKAGES = {
  REMOTE_ENTRY: "/@fluxora/plugins.module-federation/remote-entry.js",
  SINGLE_REMOTE_ENTRY: (module: string) => `/@fluxora/plugins.module-federation/single-remote-entry/${module}.js`,
  EXPOSED_MODULES_APP: (appName: string, exposedModule: string) => `/@fluxora/apps/${appName}/${exposedModule}`
} as const;

export const PACKAGE_ENTRIES = {
  FLUXORA_CLIENT: "/@fluxora/client",
  FLUXORA_CLIENT_ENTRY_CLIENT_REACT: "/@fluxora/client/react",
  FLUXORA_CLIENT_ENTRY_SERVER_REACT: "/@fluxora/client-server/react",
  FLUXORA_CLIENT_ENTRY_NOOP_REACT: "/@fluxora/client/noop",
  FLUXORA_SERVER: "/@fluxora/server",
  FLUXORA_SERVER_ENTRY: "/@fluxora/server/entry-server"
} as const;

export const PACKAGE_ENTRY_NAMES = new Set<string>(Object.values(PACKAGE_ENTRIES));

export const PACKAGE_ORIGINALS = {
  FLUXORA_CLIENT: "@fluxora/client",
  FLUXORA_CLIENT_ENTRY_CLIENT_REACT: "@fluxora/client/react/entry-client",
  FLUXORA_CLIENT_ENTRY_SERVER_REACT: "@fluxora/client/react/entry-server",
  FLUXORA_CLIENT_NOOP_REACT: "@fluxora/client/react/noop",
  FLUXORA_SERVER: "@fluxora/server",
  FLUXORA_SERVER_DEV_ENTRY: "@fluxora/server/entry-dev",
  FLUXORA_SERVER_PROD_ENTRY: "@fluxora/server/entry-prod"
} as const;

export const VIRTUAL_ALIAS_ENTRIES = {
  APP: "/@fluxora/virtual/entry/react/app",
  TEMPLATE: "/@fluxora/virtual/entry/react/template",
  SSR_ENTRY: "/@fluxora/virtual/entry/react/ssr",
  APP_MODULE: "/@fluxora/virtual/entry/app.module",
  APP_CONFIG: "/@fluxora/virtual/entry/app-config.json"
} as const;

export const PACKAGE_ENTRY_ORIGINAL_MAPPING = {
  [PACKAGE_ENTRIES.FLUXORA_CLIENT]: PACKAGE_ORIGINALS.FLUXORA_CLIENT,
  [PACKAGE_ENTRIES.FLUXORA_CLIENT_ENTRY_CLIENT_REACT]: PACKAGE_ORIGINALS.FLUXORA_CLIENT_ENTRY_CLIENT_REACT,
  [PACKAGE_ENTRIES.FLUXORA_CLIENT_ENTRY_SERVER_REACT]: PACKAGE_ORIGINALS.FLUXORA_CLIENT_ENTRY_SERVER_REACT,
  [PACKAGE_ENTRIES.FLUXORA_CLIENT_ENTRY_NOOP_REACT]: PACKAGE_ORIGINALS.FLUXORA_CLIENT_NOOP_REACT,
  [PACKAGE_ENTRIES.FLUXORA_SERVER]: PACKAGE_ORIGINALS.FLUXORA_SERVER,
  [PACKAGE_ENTRIES.FLUXORA_SERVER_ENTRY]: PACKAGE_ORIGINALS.FLUXORA_SERVER_PROD_ENTRY
} satisfies Record<ValueOf<typeof PACKAGE_ENTRIES>, string>;

export const VITE_ENVIRONMENTS = {
  SERVER: "server",
  CLIENT: "client"
} as const;

const messageVariants = ["^vite v\\d+\\.\\d+\\.\\d+", "watching for file changes", "buil[dt]", "modules transformed"];

export const VITE_MESSAGES_RE = new RegExp(messageVariants.join("|"));
export const FEDERATION_MICRO_APP_IMPORT_RE = /^\w+(?:\/\w+)?$/;
export const CONTROL_CHARS_RE = /[\u0000-\u001F\u007F-\u009F]\[\d+\w/g;

export const DEFAULT_HTML_TEMPLATE = `<!DOCTYPE html><html><head></head><body></body></html>`;

export const FEDERATION_SHARED_PACKAGES = "__fluxora__federation__shared__";

export const DIRECTORY_NAMES = {
  APP: ["apps", "applications"],
  LIB: ["libs", "libraries"],
  TEMPLATE: ["template", "libs/template", "libraries/template"]
} as const;

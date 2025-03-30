export const SERVER_ENTRY_FILE_EXTENSIONS = ["ts", "js", "mjs", "cjs"];
export const CLIENT_ENTRY_FILE_EXTENSIONS = ["ts", "js", "mjs", "cjs", "jsx", "tsx"];

export const VITE_ENVIRONMENTS = {
  SERVER: "server",
  CLIENT: "client"
} as const;

export const VIRTUAL_ENTRIES = {
  TEMPLATE: "/__virtual__/template",
  APP: Object.assign((app: string) => `/__virtual__/app/${app}`, {
    is: (id: string) => id.match(/^\/__virtual__\/app\/(.*?)$/)
  }),
  PAGE_JS: Object.assign((page: string) => `/__virtual__/page/${page}.js`, {
    is: (id: string) => id.match(/^\/__virtual__\/page\/(.*?)\.js$/)
  }),
  APP_SERVER: Object.assign((app: string) => `/__virtual__/server/${app}`, {
    is: (id: string) => id.match(/^\/__virtual__\/server\/(.*?)$/)
  })
} as const;

export const PROJECT_CWD = process.env.PROJECT_CWD || process.cwd();

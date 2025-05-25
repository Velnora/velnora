export const CLASS_METHOD_DATA = Symbol("class:method:data");
export const CLASS_PROPS_SET = Symbol("class:props");

export const VIRTUAL_ENTRIES = {
  APP_CLIENT_ENTRY(appName: string) {
    return `/@app:${appName}/entry.ts`;
  },
  APP_TEMPLATE(name: string) {
    return `/@app:${name}/template.ts`;
  },
  APP_CLIENT_ROUTES(appName: string) {
    return `/@app:${appName}/routes.ts`;
  },
  APP_CLIENT_SCRIPT(appName: string) {
    return `/@app:${appName}/entry-client.ts`;
  },
  APP_CLIENT_JSON(appName: string) {
    return `/@app:${appName}/client.json`;
  },
  APP_SERVER_ENTRY(appName: string) {
    return `/@app:${appName}/entry-server.ts`;
  }
} as const;

export const CHECK_VIRTUAL_ENTRIES: Record<keyof typeof VIRTUAL_ENTRIES, (appName: string) => boolean> = {
  APP_CLIENT_ENTRY(appName) {
    return /^\/@app:(.*)\/entry\.ts$/.test(appName);
  },
  APP_TEMPLATE(appName) {
    return /^\/@app:(.*)\/template\.ts$/.test(appName);
  },
  APP_CLIENT_ROUTES(appName) {
    return /^\/@app:(.*)\/routes\.ts$/.test(appName);
  },
  APP_CLIENT_SCRIPT(appName) {
    return /^\/@app:(.*)\/entry-client\.ts$/.test(appName);
  },
  APP_CLIENT_JSON(appName) {
    return /^\/@app:(.*)\/client\.json$/.test(appName);
  },
  APP_SERVER_ENTRY(appName) {
    return /^\/@app:(.*)\/entry-server\.ts$/.test(appName);
  }
};

export const APP_CONTAINER = "__VELNORA__APP__";

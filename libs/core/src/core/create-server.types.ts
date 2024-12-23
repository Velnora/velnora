interface ProxyOptions {
  target?: string;
  changeOrigin?: boolean;
}

interface ServerOptions {
  port?: number;
  hostname?: string;
  proxy?: ProxyOptions;
}

export interface CreateServerOptions {
  type: "client" | "server";
  env: "development" | "production";
  server?: ServerOptions;
}

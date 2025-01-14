interface ProxyOptions {
  target?: string;
  changeOrigin?: boolean;
}

export interface CreateServerOptions {
  port?: number;
  hostname?: string;
  proxy?: ProxyOptions;
}

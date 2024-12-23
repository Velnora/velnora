import { ViteDevServer } from 'vite';

export declare const createServer: (options?: CreateServerOptions) => Promise<Server>;

declare interface CreateServerOptions {
    type: "client" | "server";
    env: "development" | "production";
    server?: ServerOptions;
}

declare interface ProxyOptions {
    target?: string;
    changeOrigin?: boolean;
}

declare class Server {
    private readonly options?;
    private _viteServer;
    constructor(options?: CreateServerOptions | undefined);
    get vite(): ViteDevServer;
    init(): Promise<void>;
    serve(): Promise<void>;
}

declare interface ServerOptions {
    port?: number;
    hostname?: string;
    proxy?: ProxyOptions;
}

export { }

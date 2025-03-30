import { RunnableDevEnvironment, createServer, isRunnableDevEnvironment } from "vite";

import { tsconfigPathsPlugin } from "../plugins";

export const internalViteServer = await createServer({
  plugins: [tsconfigPathsPlugin()],
  define: { __DEV__ },
  server: { hmr: false, ws: false },
  mode: "production",
  logLevel: "silent",
  environments: { server: { consumer: "server" } },
  appType: "custom"
});

export const internalRunnableDevEnvironment = internalViteServer.environments.server as RunnableDevEnvironment;
if (!isRunnableDevEnvironment(internalRunnableDevEnvironment)) {
  throw new Error("Internal server is not runnable");
}

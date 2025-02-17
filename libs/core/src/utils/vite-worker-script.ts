import { createRequire } from "node:module";

const require = createRequire(import.meta.url);
export const viteWorkerScript = require.resolve("@fluxora/worker/vite");

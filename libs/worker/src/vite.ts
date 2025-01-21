import workerpool from "workerpool";

import * as viteHandlers from "./core/vite";

workerpool.worker({ ...viteHandlers });

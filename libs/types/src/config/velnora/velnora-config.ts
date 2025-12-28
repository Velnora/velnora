import type { Integration } from "../../integration";
import type { Apps } from "./apps";
import type { Experiments } from "./experiments";
import type { Server } from "./server";

export interface VelnoraConfig {
  mode: string;
  root: string;
  apps: Apps;
  server: Server;
  integrations: Array<Integration>;
  experiments: Experiments;

  cacheDir: string;
}

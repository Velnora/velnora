import type { Integration } from "../../integration";
import type { Experiments } from "./experiments";
import type { Server } from "./server";
import type { Workspace } from "./workspace";

export interface VelnoraConfig {
  mode: string;
  root: string;
  hostApp: string;
  server: Server;
  workspace: Workspace;
  integrations: Array<Integration>;
  experiments: Experiments;

  cacheDir: string;
}

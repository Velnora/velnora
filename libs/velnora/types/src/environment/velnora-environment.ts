import type { IncomingMessage, Server, ServerResponse } from "node:http";

import { Velnora } from "../namespace";
import type { EnvironmentConfig } from "../user-config";

export interface VelnoraEnvironment extends Velnora.VelnoraEnvironment {
  isValidEnvironment(environment: EnvironmentConfig): boolean;

  createServer(handler: (req: IncomingMessage, res: ServerResponse) => void): Server;
}

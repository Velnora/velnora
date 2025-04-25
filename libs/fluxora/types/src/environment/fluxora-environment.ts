import type { IncomingMessage, Server, ServerResponse } from "node:http";

import { Fluxora } from "../namespace";
import type { EnvironmentConfig } from "../user-config";

export interface FluxoraEnvironment extends Fluxora.FluxoraEnvironment {
  isValidEnvironment(environment: EnvironmentConfig): boolean;

  createServer(handler: (req: IncomingMessage, res: ServerResponse) => void): Server;
}

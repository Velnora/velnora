import { z } from "zod";

import { PackageKind } from "../../../types";
import type { Client } from "./client.schema";
import type { Server } from "./server.schema";

export const velnoraAppConfigSchema = z.object({
  kind: z.enum(Object.values(PackageKind).filter(v => v !== PackageKind.Unknown)).optional(),
  runtime: z.string().optional(),
  clientPath: z.string().optional(),
  serverPath: z.union([z.string(), z.function({ input: [z.number().positive()], output: z.string() })]).optional()
});

export interface VelnoraAppConfig {
  kind?: PackageKind;
  runtime?: string;

  client: Client;
  server: Server;

  integrations: Velnora.AppConfigExtensions;
}

import type { PackageKind } from "../../package";
import type { Client } from "./client";
import type { Server } from "./server";

export interface VelnoraAppConfig {
  kind?: PackageKind;
  runtime?: string;

  client: Client;
  server: Server;

  integrations: Velnora.AppConfigExtensions;
}

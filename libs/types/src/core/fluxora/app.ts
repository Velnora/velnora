import type { AppConfig } from "@fluxora/types";

import type { AppType } from "../app-type";
import type { Package } from "./package";
import type { RemoteEntry } from "./remote-entry";

export interface App extends Package {
  config: AppConfig;
  type: AppType.APPLICATION;
  host: string;
  devWsPort?: number | null;
  isHost: boolean;
  remoteEntry: RemoteEntry;
  outDirRoot: string;
}

import type { Http, VelnoraConfig } from "@velnora/types";

import type { ViteContainer } from "../vite-container";
import { ViteDev } from "./vite-dev";

export class ViteServer {
  static createDevServer(container: ViteContainer, config: VelnoraConfig, server: Http) {
    return new ViteDev(container, config, server);
  }

  static createPreviewServer() {}
}

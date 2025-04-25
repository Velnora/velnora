import { environmentRegistry } from "@fluxora/environment-loader";

import environment from "./environment";

environmentRegistry.register("@fluxora/environment-node", environment);

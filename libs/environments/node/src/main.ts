import { environmentRegistry } from "@velnora/environment-loader";

import environment from "./environment";

environmentRegistry.register("@velnora/environment-node", environment);

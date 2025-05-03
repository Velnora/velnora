import { adapterRegistry } from "@velnora/adapter-loader";

import expressAdapter, { adapterName } from "./adapter/main";

adapterRegistry.register(adapterName, await expressAdapter);

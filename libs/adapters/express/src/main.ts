import { adapterRegistry } from "@fluxora/adapter-loader";

import expressAdapter, { adapterName } from "./adapter/main";

adapterRegistry.register(adapterName, await expressAdapter);

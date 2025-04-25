import { singleton } from "@fluxora/utils";

import { AppContext } from "./app.context";

export const appCtx = singleton("__FLUXORA_APP_CTX__", () => new AppContext());

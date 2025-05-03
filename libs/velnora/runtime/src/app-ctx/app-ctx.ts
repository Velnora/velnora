import { singleton } from "@velnora/utils";

import { AppContext } from "./app.context";

export const appCtx = singleton("__VELNORA_APP_CTX__", () => new AppContext());

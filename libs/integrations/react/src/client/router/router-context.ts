import { createContext } from "react";

import type { Router } from "@velnora/router/client";

interface RouterContext {
  router: Router;
}

export const routerContext = createContext<RouterContext>(null!);

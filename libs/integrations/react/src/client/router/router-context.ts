import type { Router } from "@velnora/router/client";
import { createContext } from "react";

interface RouterContext {
  router: Router;
}

export const routerContext = createContext<RouterContext>(null!);

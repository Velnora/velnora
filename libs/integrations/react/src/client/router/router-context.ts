import { createContext } from "react";
import type { Router } from "velnora/router";

interface RouterContext {
  router: Router;
}

export const routerContext = createContext<RouterContext>(null!);

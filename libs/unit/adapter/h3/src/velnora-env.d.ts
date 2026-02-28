import type { HttpAdapter } from "./types/http-adapter";

declare global {
  namespace Velnora {
    interface UnitRegistry {
      http: HttpAdapter;
      h3: HttpAdapter;
    }
  }
}

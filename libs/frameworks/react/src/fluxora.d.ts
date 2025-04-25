import "@fluxora/types";

import { ReactOptions } from "./types/react-options";

declare module "@fluxora/types" {
  namespace Fluxora {
    interface UserConfig {
      react: ReactOptions;
    }
  }
}

import "@velnora/types";

import { ReactOptions } from "./types/react-options";

declare module "@velnora/types" {
  namespace Velnora {
    interface UserConfig {
      react: ReactOptions;
    }
  }
}

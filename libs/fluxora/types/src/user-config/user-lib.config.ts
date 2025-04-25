import type { PartialDeep } from "type-fest";

import { Fluxora } from "../namespace";

export interface UserLibConfig extends Fluxora.UserLibConfig {
  /**
   * The entry point of the library.
   * This is the file that will be used as the entry point for the library.
   * It can be a relative path or an absolute path.
   */
  entry: string;
}

export type PartialUserLibConfig = PartialDeep<UserLibConfig>;

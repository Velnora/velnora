import type { PartialDeep } from "type-fest";

import { Fluxora } from "../namespace";
import type { Framework } from "./framework";

export interface UserTemplateConfig extends Fluxora.UserTemplateConfig {
  /**
   *
   */
  entry: string;

  /**
   * Select frameworks which want to use as primary.
   *
   * @default "react"
   */
  framework: Framework;
}

export type PartialUserTemplateConfig = PartialDeep<UserTemplateConfig>;

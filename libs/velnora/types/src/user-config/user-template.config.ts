import type { PartialDeep } from "type-fest";

import { Velnora } from "../namespace";
import type { Framework } from "./framework";

export interface UserTemplateConfig extends Velnora.UserTemplateConfig {
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

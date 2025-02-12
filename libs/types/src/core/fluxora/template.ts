import type { AppType } from "../app-type";
import type { Lib } from "./lib";

export interface Template extends Omit<Lib, "type"> {
  type: AppType.TEMPLATE;
  buildOutput?: string;
}

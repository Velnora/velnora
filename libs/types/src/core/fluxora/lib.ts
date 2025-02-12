import type { AppType } from "../app-type";
import type { Package } from "./package";

export interface Lib extends Package {
  type: AppType.LIBRARY;
}

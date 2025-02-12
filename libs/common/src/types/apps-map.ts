import { type App, AppType, type Lib, type Template } from "@fluxora/types/core";

export interface AppsMap {
  [AppType.APPLICATION]: Record<string, App>;
  [AppType.LIBRARY]: Record<string, Lib>;
  [AppType.TEMPLATE]: Record<string, Template>;
}

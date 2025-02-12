import { AppType } from "./app-type";

export interface MicroLibrary {
  type: AppType.LIBRARY;
  root: string;
  name: string;
}

export interface MicroTemplate extends Pick<MicroLibrary, "root" | "name"> {
  type: AppType.TEMPLATE;
}

export interface MicroAppHost {
  host: string;
  devWsPort?: number;
}

export interface MicroApplication extends Pick<MicroLibrary, "root" | "name"> {
  type: AppType.APPLICATION;
  host: MicroAppHost;
  isHost: boolean;
}

export type MicroApp = MicroApplication | MicroTemplate | MicroLibrary;

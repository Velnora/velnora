export type AppName = `${AppType.APPLICATION | AppType.LIBRARY | AppType.TEMPLATE}::${string}`;

export enum AppType {
  APPLICATION = "application",
  LIBRARY = "library",
  TEMPLATE = "template"
}

export interface MicroLibrary {
  type: AppType.LIBRARY;
  root: string;
  name: AppName;
}

export interface MicroTemplate extends Pick<MicroLibrary, "root" | "name"> {
  type: AppType.TEMPLATE;
  buildOutput?: string;
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

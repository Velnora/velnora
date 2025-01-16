export interface MicroAppHost {
  host: string;
  devWsPort: number;
}

export interface MicroApp {
  root: string;
  name: string;
  host: MicroAppHost;
}

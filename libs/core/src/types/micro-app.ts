export interface MicroAppHost {
  clientHost: string;
  serverHost: string;
  devWsPort: number;
}

export interface MicroApp {
  root: string;
  name: string;
  host: MicroAppHost;
}

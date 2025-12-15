export interface Server {
  url?: string | ((majorVersion: number) => string);
}

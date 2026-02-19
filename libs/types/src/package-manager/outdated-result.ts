export interface OutdatedResult {
  packages: { name: string; current: string; latest: string; wanted: string }[];
}

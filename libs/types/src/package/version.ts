export interface Version {
  full: string;
  major: number;
  minor: number;
  patch: number;
  prerelease: string | null;
}

export interface PkgApi {
  ensurePackage(pkg: string): boolean;
  ensurePackage(pkg: string, version: string): boolean;
}

export interface InstallOptions {
  frozen?: boolean; // use lockfile exactly, fail if out of sync
  production?: boolean; // skip dev dependencies
}

export interface Artifact {
  path: string;
  type: string; // e.g. "jar", "dll", "binary", "tgz"
  size?: number;
}

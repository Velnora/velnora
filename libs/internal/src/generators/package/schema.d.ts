export interface PackageGeneratorSchema {
  name: string;
  directory: string;
  target?: "node" | "web";
  scope: string;
  tags: string | string[];
  skipTests?: boolean;
}

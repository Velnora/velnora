import { Velnora } from "../namespace";

export interface BuildSettings extends Velnora.BuildSettings {
  /**
   * Specifies the path to the build directory.
   * The path is relative to the project root.
   *
   * @type {string}
   * @default "build"
   */
  outDir: string;
}

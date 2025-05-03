import { Velnora } from "../namespace";

export interface CacheSettings extends Velnora.CacheSettings {
  /**
   * Specifies the path to the cache directory.
   * Relative to the workspace root.
   *
   * @type {string}
   * @default ".velnora/cache"
   */
  root: string;
}

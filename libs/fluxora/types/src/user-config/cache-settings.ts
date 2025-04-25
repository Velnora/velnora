import { Fluxora } from "../namespace";

export interface CacheSettings extends Fluxora.CacheSettings {
  /**
   * Specifies the path to the cache directory.
   * Relative to the workspace root.
   *
   * @type {string}
   * @default ".fluxora"
   */
  root: string;
}

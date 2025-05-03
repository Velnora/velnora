import { Velnora } from "../namespace";

/**
 * The path to the client and server entry files.
 */
export interface Entry extends Velnora.Entry {
  /**
   * The path to the client entry file.
   * @default "client/entry-client"
   */
  client: string;

  /**
   * The path to the server entry file.
   * @default "server/<app-name>.module"
   */
  server: string;
}

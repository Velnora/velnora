/**
 * @velnora-meta
 * type: author
 * author: MDReal
 */

export interface LogError {
  name: string;
  message: string;
  stack?: string;
  cause?: unknown;
}

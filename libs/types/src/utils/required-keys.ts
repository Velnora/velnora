/**
 * @velnora-meta
 * type: author
 * author: MDReal
 */

/**
 * Makes the specified keys of `TObject` required while keeping the rest optional.
 *
 * Useful when a function needs only a subset of fields to be guaranteed present
 * (e.g. CLI options where `host` and `port` must always exist but everything
 * else can be omitted).
 *
 * @template TObject - The source object type.
 * @template TRequiredKeys - Union of keys from `TObject` that must be required.
 *
 * @example
 * ```typescript
 * type Options = { host?: string; port?: number; verbose?: boolean };
 * type Resolved = RequiredKeys<Options, "host" | "port">;
 * // => { verbose?: boolean } & { host: string; port: number }
 * ```
 */
export type RequiredKeys<TObject, TRequiredKeys extends keyof TObject> = Partial<Omit<TObject, TRequiredKeys>> &
  Required<Pick<TObject, TRequiredKeys>>;

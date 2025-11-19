export interface Telemetry {
  /** Trace a function within a span; implementors may no-op. */
  span<T>(name: string, fn: () => Promise<T> | T): Promise<T>;
}

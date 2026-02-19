export interface ExecuteOptions {
  args?: string[]; // CLI arguments passed to the binary
  env?: Record<string, string>; // additional environment variables
  port?: number; // preferred port (runtime picks if omitted)
  watch?: boolean; // enable file-watching / hot-reload if supported
}

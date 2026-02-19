export interface ToolchainProcess<T> {
  stdout: ReadableStream<string>; // pipe to Velnora logger / CLI output
  stderr: ReadableStream<string>;
  result: Promise<T>; // resolves when the process completes
  kill(): Promise<void>;
}

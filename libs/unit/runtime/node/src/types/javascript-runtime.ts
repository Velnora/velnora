export interface JavaScriptRuntime {
  run(file: string): Promise<void>;
}

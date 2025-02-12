export interface FileActions {
  // region File actions
  create: () => Promise<void>;
  createDir: () => Promise<void>;
  read: () => Promise<string>;
  readJson: <TJson extends object>() => Promise<TJson>;
  write: (content: string) => Promise<void>;
  writeJson: <TJson extends object>(content: TJson) => Promise<void>;
  delete: () => Promise<void>;
  // endregion

  // region Path actions
  relative(to: string): string;
  dirname(): string;
  fixed(): string;
  // endregion
}

export interface WrapShareScope {
  [key: string]: {
    [version: string]: {
      get: () => any;
    };
  };
}

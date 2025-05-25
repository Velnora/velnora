export type NonFunction<T> = T extends (...args: any[]) => any
  ? never
  : T extends object
    ? {
        [K in keyof T as T[K] extends (...args: any[]) => any ? never : K]: T[K];
      }
    : T;

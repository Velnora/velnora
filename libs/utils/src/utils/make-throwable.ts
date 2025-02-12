import type { ValueOf } from "type-fest";

export const makeThrowable = <T extends Record<string, (...args: any[]) => any>>(
  handlers: T,
  errorMessage?: string
) => {
  const entries = Object.entries(handlers) as [keyof T, ValueOf<T>][];
  return entries.reduce(
    (acc, [key, handler]) => {
      acc[key] = (...args: any[]) => {
        try {
          return handler(...args);
        } catch (error) {
          console.log(error);
          throw new Error(errorMessage, { cause: error });
        }
      };
      return acc;
    },
    {} as { [K in keyof T]: (...args: Parameters<T[K]>) => Promise<Awaited<ReturnType<T[K]>>> }
  );
};

import type { EventMessage } from "./event-message";

export type Eventify<T extends Record<string, any>> = {
  [K in keyof T]: K extends string ? EventMessage<K, T[K]> : never;
}[keyof T];

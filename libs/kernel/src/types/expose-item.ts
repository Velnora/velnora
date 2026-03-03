export type ExposeItem =
  | { kind: "set"; key: string; value: unknown }
  | { kind: "resolve"; key: string; resolveKey: string };

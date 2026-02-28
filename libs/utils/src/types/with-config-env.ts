import type { ConfigEnv } from "@velnora/types";

export type WithConfigEnv<T> = ((env: ConfigEnv) => T) | T;

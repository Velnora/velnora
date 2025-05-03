import type { LiteralUnion } from "type-fest";

type UnionFrameworks = "react";
export type Framework = LiteralUnion<UnionFrameworks, string>;

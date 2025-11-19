import { z } from "zod";

export const stageSchema = z.literal(["configure", "scaffold", "build", "runtime"]);
export type Stage = "configure" | "scaffold" | "build" | "runtime";
